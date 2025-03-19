import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInUser, googleSignin } from '../Firebase/auth';
import GoogleButton from "react-google-button";
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({ email: '', password: '' });
    

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!values.isSignedIn) {
            setValues((prev) => ({ ...prev, isSignedIn: true }));
    
            try {
                await signInUser(values.email, values.password);

                const response = await fetch("http://18.211.153.46:8080/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                    }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("userEmail", values.email);
                    alert("Login successful!");
                    navigate("/home");
                }
                else {
                    alert(data.error || "Invalid credentials");
                    setValues((prev) => ({ ...prev, isSignedIn: false }));
                }
            } catch (error) {
                alert("Error logging in: " + error.message);
                setValues((prev) => ({ ...prev, isSignedIn: false }));
            }
        }
    };
    

    return (
        <div className='login'>
            <div className='login-form'>
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className='input'>
                        <input type='email' placeholder='Email' onChange={handleInput} name='email' value={values.email} />
                    </div>
                    <div className='input'>
                        <input type='password' placeholder='Password' onChange={handleInput} name='password' value={values.password} />
                    </div>
                    <button type='submit'>Login</button>
                    <div className="google-btn">
                        <GoogleButton className="g-btn" type="dark" onClick={googleSignin} />
                    </div>
                    <div className='register-link'>
                        <p>Don't have an account?{' '}
                            <Link to="/signup" className="link">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;
