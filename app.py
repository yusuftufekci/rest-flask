from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify
import pymysql
USER = 'root'
PASSWORD = 'karadeniz'
DATABASE = 'lecture_schedule'
# connection_name is of the format `project:region:your-cloudsql-instance`
CONNECTION_NAME = 'halogen-pier-297117:us-central1:smartcampus'

SQLALCHEMY_DATABASE_URI = (
    'mysql+pymysql://{user}:{password}@localhost/{database}'
    '?unix_socket=/cloudsql/{connection_name}').format(
        user=USER, password=PASSWORD,
        database=DATABASE, connection_name=CONNECTION_NAME)



app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] =  SQLALCHEMY_DATABASE_URI



db = SQLAlchemy(app)

class student(db.Model):
    studentNumber = db.Column(db.Integer, primary_key=True)
    name = db.Column( db.Unicode)
    departmentID = db.Column(db.Integer, db.ForeignKey("department.ID"))

    def __init__(self,name,departmentID):
        self.name = name
        self.departmentID = departmentID


class Classroom(db.Model):
    ClassroomID = db.Column(db.Integer, primary_key=True)
    capacity = db.Column(db.Integer)
    Lab = db.Column(db.Boolean)
    Location = db.Column(db.Unicode)
    name = db.Column(db.Unicode)
    sensorses = db.relationship('Sensors', backref='classroom')

    def __init__(self,capacity,Lab,Location,name):
        self.capacity = capacity
        self.Lab = Lab
        self.Location = Location
        self.name = name


class courses(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    courseCode = db.Column(db.Unicode)
    credit = db.Column(db.Integer)
    name = db.Column(db.Unicode)
    departmentID = db.Column(db.Integer, db.ForeignKey("department.ID"))
    sections = db.relationship('section', backref='courses')

    def __init__(self, courseCode, credit, name, departmentID):
        self.courseCode = courseCode
        self.credit = credit
        self.departmentID = departmentID
        self.name = name


class department(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode)
    facultyID = db.Column(db.Integer, db.ForeignKey("faculty.ID"))
    instructors = db.relationship('instructor', backref='department')
    courses = db.relationship('courses', backref='department')
    students = db.relationship('student', backref='department')

    def __init__(self, name, facultyID):
        self.name = name
        self.facultyID = facultyID



class enrollment(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    studentID = db.Column(db.Integer, db.ForeignKey("student.studentNumber"))
    sectionID = db.Column(db.Integer, db.ForeignKey("section.ID"))

    def __init__(self, studentID, sectionID):
        self.studentID = studentID
        self.sectionID = sectionID


class faculty(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode)
    departments = db.relationship('department', backref='faculty')

    def __init__(self, name):
        self.name = name

class instructor(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode)
    departmentID = db.Column(db.Integer, db.ForeignKey("department.ID"))

    def __init__(self, departmentID, name):
        self.departmentID = departmentID
        self.name = name

class section(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.Integer)
    time = db.Column(db.Unicode)
    instructorID = db.Column(db.Integer, db.ForeignKey("instructor.ID"))
    courseID = db.Column(db.Integer, db.ForeignKey("courses.ID"))
    classroomID = db.Column(db.Integer, db.ForeignKey("classroom.ClassroomID"))

    def __init__(self, section, time, instructorID, courseID, classroomID):
        self.section = section
        self.time = time
        self.instructorID = instructorID
        self.courseID = courseID
        self.classroomID = classroomID

class Sensors(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    Tempature = db.Column(db.Integer)
    humidity = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    classroomID = db.Column(db.Integer, db.ForeignKey("classroom.ClassroomID"))

    def __init__(self, Tempature, humidity, date, classroomID):
        self.Tempature = Tempature
        self.humidity = humidity
        self.date = date
        self.classroomID = classroomID

@app.route('/', methods=['GET', 'POST'])
def welcome():
    user = student.query.get("041501008")

    return user.name




@app.route('/api/users/<id>', methods=['GET', 'POST'])
def home(id):

    studentName = student.query.filter_by(studentNumber=id).first()

    if studentName == None:
        return "There is no student with this id"

    else:
        departmentName = department.query.filter_by(ID=studentName.departmentID).first()
        facultyName = faculty.query.filter_by(ID=departmentName.facultyID).first()
        enrollmentID = enrollment.query.filter_by(studentID=id).first()
        sectionID = enrollmentID.sectionID
        sectionSS = section.query.filter_by(ID=sectionID).first()
        instructorSS = instructor.query.filter_by(ID=sectionSS.instructorID).first()
        instructorName=instructorSS.name
        courseSS = courses.query.filter_by(ID=sectionSS.courseID).first()
        courseCode=courseSS.courseCode
        courseCredit=courseSS.credit
        courseName=courseSS.name
        data = [departmentName.name, facultyName.name, studentName.name, instructorName, courseCode, courseCredit,
                courseName]

    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
