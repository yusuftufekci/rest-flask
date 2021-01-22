import React, {useState} from 'react'
import {Link} from "react-router-dom";
import axios from 'axios';
import style from "./Register.module.css";

const Register = (props) => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(undefined);
    const [okMessage, setOkMessage] = useState(undefined);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.username && formData.password && formData.email) {
            axios.post("https://smartcampus3.herokuapp.com/register", formData).then(response => {
                setOkMessage("Registration successful");
                setError(undefined);
            }).catch((error) => {
                setOkMessage(undefined);
                setError("This username or email already registered");
            });
        }
    }

    const handleChange = (e) => {
        setFormData(prevState => {
            return {...prevState, [e.target.id]: e.target.value}
        });
    }

    return (
        <div className={style.myContainer}>
            <div className={style.outer}>
                <div className={style.inner}>
                    <form onSubmit={handleSubmit}>
                        <h3>Smart Campus</h3>
                        <h5>Register</h5>
                        {error && <div className="alert alert-danger" role="alert"> {error} </div>}
                        {okMessage && <div className="alert alert-success" role="alert"> {okMessage} <Link to="/login" className="alert-link">log in</Link> </div>}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" onChange={handleChange}
                                   required/>
                        </div>
                        <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
                        <p className="forgot-password text-right mt-2">
                            Already registered <Link to="/login">log in?</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;