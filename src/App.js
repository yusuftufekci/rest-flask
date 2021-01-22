import './App.css';
import StudentHome from './Components/StudentHome';
import Lecture from './Components/Lecture';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import PrivateRoute from "./Auth/PrivateRoute";
import Login from "./Components/login/Login";
import {useState} from "react";
import Register from "./Components/register/Register";
import {StudyGroup} from './Components/Studygroup';
import TeacherHome from "./Components/TeacherHome";
import LectureTeacher from "./Components/LectureTeacher";
import AdminHome from "./Components/AdminHome";
import UploadExcel from "./Components/UploadExcel";

function App() {
    const [user, setUser] = useState(false);

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login">
                    <Login user={user} setUser={setUser}/>
                </Route>
                <Route path="/register">
                    <Register/>
                </Route>

                {user.role === "student" && <>
                    <PrivateRoute path='/' user={user} setUser={setUser} exact>
                        <StudentHome/>
                    </PrivateRoute>
                    <PrivateRoute path='/Lecture' user={user} setUser={setUser}>
                        <Lecture user={user}/>
                    </PrivateRoute>
                    <PrivateRoute path='/StudyGroup' user={user} setUser={setUser}>
                        <StudyGroup/>
                    </PrivateRoute>
                </>}
                {user.role === "instructor" && <>
                    <PrivateRoute path='/' user={user} setUser={setUser} exact>
                        <TeacherHome/>
                    </PrivateRoute>
                    <PrivateRoute path='/Lecture' user={user} setUser={setUser}>
                        <LectureTeacher user={user}/>
                    </PrivateRoute>
                    <PrivateRoute path='/StudyGroup' user={user} setUser={setUser}>
                        <StudyGroup/>
                    </PrivateRoute>
                    
                </>}
                {user.role === "admin" && <>
                    <PrivateRoute path='/' user={user} setUser={setUser} exact>
                        <AdminHome/>
                    </PrivateRoute>
                    <PrivateRoute path='/uploadExcel' user={user} setUser={setUser} exact>
                        <UploadExcel/>
                    </PrivateRoute>

                </>}

                <Route path="*">
                    <Login user={user} setUser={setUser}/>
                </Route>
            </Switch>

        </BrowserRouter>
    );
}

export default App;
