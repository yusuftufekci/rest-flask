from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify
import json
from flask_cors import CORS, cross_origin
from flask import Blueprint, render_template, redirect, url_for, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, render_template, redirect, url_for, request, flash
import random
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)



##sonuççç

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:karadeniz@34.121.66.9/lecture_schedule1'
app.secret_key = 'super secret key'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)
cors = CORS(app)





db = SQLAlchemy(app)

class Student(db.Model):
    studentNumber = db.Column(db.Integer, primary_key=True)
    name = db.Column( db.Unicode)
    departmentID = db.Column(db.Integer, db.ForeignKey("department.ID"))
    enrollments = db.relationship("Enrollment")
    mail = db.Column(db.Unicode)
    def __init__(self, name, departmentID,mail):
        self.name = name
        self.departmentID = departmentID
        self.mail = mail


class Classroom(db.Model):
    ClassroomID = db.Column(db.Integer, primary_key=True)
    capacity = db.Column(db.Integer)
    Lab = db.Column(db.Boolean)
    Location = db.Column(db.Unicode)
    name = db.Column(db.Unicode)
    sections = db.relationship('Section', backref='Classroom')
    sensorses = db.relationship('Sensors', backref='Classroom')

    def __init__(self, capacity, Lab, Location, name):
        self.capacity = capacity
        self.Lab = Lab
        self.Location = Location
        self.name = name


class Courses(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    courseCode = db.Column(db.Unicode)
    credit = db.Column(db.Integer)
    name = db.Column(db.Unicode)
    departmentID = db.Column(db.Integer, db.ForeignKey("department.ID"))
    sections = db.relationship('Section', backref='Courses')

    def __init__(self, courseCode, credit, name):
        self.courseCode = courseCode
        self.credit = credit
        self.name = name


class Department(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode)
    facultyID = db.Column(db.Integer, db.ForeignKey("faculty.ID"))
    instructors = db.relationship('Instructor', backref='Department')
    courses = db.relationship('Courses', backref='Department')
    students = db.relationship('Student', backref='Department')

    def __init__(self, name, facultyID):
        self.name = name




class Enrollment(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    studentID = db.Column(db.Integer, db.ForeignKey("student.studentNumber"))
    sectionID = db.Column(db.Integer, db.ForeignKey("section.ID"))




class Faculty(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode)
    departments = db.relationship('Department', backref='Faculty')

    def __init__(self, name):
        self.name = name

class Instructor(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode)
    departmentID = db.Column(db.Integer, db.ForeignKey("department.ID"))
    sections = db.relationship('Section', backref='Instructor')
    mail = db.Column(db.Unicode)

    def __init__(self, departmentID, name, mail):
        self.departmentID = departmentID
        self.name = name
        self.mail = mail

class Section(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.Integer)
    time = db.Column(db.Unicode)
    instructorID = db.Column(db.Integer, db.ForeignKey("instructor.ID"))
    courseID = db.Column(db.Integer, db.ForeignKey("courses.ID"))
    classroomID = db.Column(db.Integer, db.ForeignKey("classroom.ClassroomID"))
    enrollments = db.relationship("Enrollment", backref="Section")

    def __init__(self, section, time ):
        self.section = section
        self.time = time


class Sensors(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    Tempature = db.Column(db.Integer)
    humidity = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    classroomID = db.Column(db.Integer, db.ForeignKey("classroom.ClassroomID"))

    def __init__(self, Tempature, humidity, date):
        self.Tempature = Tempature
        self.humidity = humidity
        self.date = date

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.Unicode)
    email = db.Column(db.Unicode)
    role = db.Column(db.Unicode)
@cross_origin()
@app.route('/', methods=['GET', 'POST'])
def welcome():

    studentName = Student.query.filter_by(studentNumber="041501008").first()

    return str(studentName.mail)




@app.route('/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    email = data["email"]
    password = data["password"]
    role = data["role"]



    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database

    if user: # if a user is found, we want to redirect back to signup page so user can try again
        return "Hata mesaji", 400

    # create a new user with the form data. Hash the password so the plaintext version isn't saved.
    new_user = User(email=email,role=role,  password=generate_password_hash(password, method='sha256'))
    access_token = create_access_token(identity=data['username'])
    refresh_token = create_refresh_token(identity=data['username'])
    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return "Ok message",access_token,refresh_token


@app.route('/login', methods=['POST'])
def login_post():

    data = request.get_json(force=True)
    email = data["email"]
    password = data["password"]


    user = User.query.filter_by(email=email).first()
    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.password, password):
        return "giris basarisiz"


        # if the user doesn't exist or password is wrong, reload the page
    role = user.role
    access_token = create_access_token(identity=data['email'])
    refresh_token = create_refresh_token(identity=data['email'])
    # if the above check passes, then we know the user has the right credentials

    return "giris basarili",role,access_token,refresh_token

@app.route('/api/users/<id>', methods=['GET', 'POST'])
def home(id):

    studentName = Student.query.filter_by(mail=id).first()
    if studentName == None:
        return "There is no student with this id"

    else:
        departmentName = Department.query.filter_by(ID=studentName.departmentID).first()
        facultyName = Faculty.query.filter_by(ID=departmentName.facultyID).first()
        enrollmentID = Enrollment.query.filter_by(studentID=id).first()
        sectionID = enrollmentID.sectionID
        sectionSS = Section.query.filter_by(ID=sectionID).first()
        sectionTime = sectionSS.time

        instructorSS = Instructor.query.filter_by(ID=sectionSS.instructorID).first()
        instructorName=instructorSS.name
        courseSS = Courses.query.filter_by(ID=sectionSS.courseID).first()
        courseCode=courseSS.courseCode
        courseCredit=courseSS.credit
        courseName=courseSS.name

        d = [{
            'Department': departmentName.name,
            'Faculty': facultyName.name,
            'StudentName': studentName.name,
            'Instructor': instructorName,
            'CourseCode': courseCode,
            'CourseCredit': courseCredit,
            'CourseName': courseName,
            'SectionTime': sectionTime

        }]
        d2 = json.dumps(d)

    return d2

@app.route('/api/user/<email>', methods=['GET', 'POST'])
def get_lectures(email):

    studentName = Student.query.filter_by(mail=email).first()
    studentID = studentName.studentNumber
    if studentName == None:
        return "There is no student with this email"

    else:
        departmentName = Department.query.filter_by(ID=studentName.departmentID).first()
        facultyName = Faculty.query.filter_by(ID=departmentName.facultyID).first()
        enrollmentID = Enrollment.query.filter_by(studentID=studentID).first()
        sectionID = enrollmentID.sectionID
        sectionSS = Section.query.filter_by(ID=sectionID).first()
        sectionTime = sectionSS.time
        instructorSS = Instructor.query.filter_by(ID=sectionSS.instructorID).first()
        instructorName=instructorSS.name
        courseSS = Courses.query.filter_by(ID=sectionSS.courseID).first()
        courseCode=courseSS.courseCode
        courseCredit=courseSS.credit
        courseName=courseSS.name

        d = [{
            'Department': departmentName.name,
            'Faculty': facultyName.name,
            'StudentName': studentName.name,
            'Instructor': instructorName,
            'CourseCode': courseCode,
            'CourseCredit': courseCredit,
            'CourseName': courseName,
            'SectionTime': sectionTime
        }]
        d2 = json.dumps(d)

    return d2

if __name__ == '__main__':
    app.run()
