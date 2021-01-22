import React, {useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import axios from 'axios';
import style from "./Login.module.css";
import Spinner from "../spinner/Spinner";

const Login = (props) => {
    const history = useHistory();
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.email && formData.password) {
            setLoading(true);
            axios.post("https://smartcampus3.herokuapp.com/login", formData).then(response => {
                props.setUser(Object.assign(response.data[0], formData));
                history.push("/");
                setLoading(false);
            }).catch(() => {
                setError("Username or Password incorrect");
                setLoading(false);
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
                    {loading ? <Spinner/> :
                        <form onSubmit={handleSubmit}>
                            <h3>Smart Campus</h3>
                            <h5>Log in</h5>
                            {error && <div className="alert alert-danger" role="alert"> {error} </div>}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" onChange={handleChange}
                                       required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" onChange={handleChange}
                                       required/>
                            </div>
                            <button type="submit" className="btn-dark btn-lg btn-block">Login</button>
                            <p className="forgot-password text-right mt-2">
                                Not registered <Link to="/register">Register?</Link>
                            </p>
                        </form>}
                </div>
            </div>
        </div>
    )
}

export default Login;