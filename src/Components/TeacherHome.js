import React from 'react'

const TeacherHome = () => {
    return <>
        <div className="mt-5 container">
            <div className="text-center">
                <h3>
                    Welcome to teacher home page
                </h3>
            </div>
            <div className="row justify-content-center mt-5">
                <p>
                    In this project, we thought of making a smart campus for the school. We proceeded according to the needs of students and teachers.Firstly we make SCADA implemention in the Campus. We will set up a system that will check the course information. How many people take this course? Which teacher teaches? What time is the class? How is the air temperature in the classroom?  We will set up a database that holds this information. We will develop a mobile application find students can access this information. Students will be given a warning in practice 10 minutes before entering the class. Students will be warned 10 minutes before entering the class by application. In this way, students will not miss their lessons and will learn where the lesson is. We will establish a system that gives us the information of the environment in the classroom. Is there any harmful gas leak in the environment? How is the oxygen level? The purpose of this is to warn the management in case of a bad situation.
                </p>
                <img src="images/SmartCampus.jpg" alt="Smart Campus"/>
            </div>
        </div>
    </>
};

export default TeacherHome;