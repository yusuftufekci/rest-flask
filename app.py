from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify

##sonuççç

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:karadeniz@34.121.66.9/lecture_schedule1'




db = SQLAlchemy(app)

class Student(db.Model):
    studentNumber = db.Column(db.Integer, primary_key=True)
    name = db.Column( db.Unicode)
    departmentID = db.Column(db.Integer, db.ForeignKey("department.ID"))
    enrollments = db.relationship("Enrollment")
    def __init__(self, name, departmentID):
        self.name = name
        self.departmentID = departmentID


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

    def __init__(self, departmentID, name):
        self.departmentID = departmentID
        self.name = name

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


@app.route('/', methods=['GET', 'POST'])
def welcome():
    user = Student.query.get("041501008")
    return user.name




@app.route('/api/users/<id>', methods=['GET', 'POST'])
def home(id):

    studentName = Student.query.filter_by(studentNumber=id).first()
    if studentName == None:
        return "There is no student with this id"

    else:
        departmentName = Department.query.filter_by(ID=studentName.departmentID).first()
        facultyName = Faculty.query.filter_by(ID=departmentName.facultyID).first()
        enrollmentID = Enrollment.query.filter_by(studentID=id).first()
        sectionID = enrollmentID.sectionID
        sectionSS = Section.query.filter_by(ID=sectionID).first()
        instructorSS = Instructor.query.filter_by(ID=sectionSS.instructorID).first()
        instructorName=instructorSS.name
        courseSS = Courses.query.filter_by(ID=sectionSS.courseID).first()
        courseCode=courseSS.courseCode
        courseCredit=courseSS.credit
        courseName=courseSS.name


    return {
            'Department': departmentName.name,
            'Faculty': facultyName.name,
            'StudentName': studentName.name,
            'Instructor': instructorName,
            'CourseCode': courseCode,
            'CourseCredit': courseCredit,
            'CourseName': courseName
        }

if __name__ == '__main__':
    app.run()
