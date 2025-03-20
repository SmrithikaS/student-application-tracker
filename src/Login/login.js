import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { signInUser,googleSignin } from '../Firebase/auth';
import GoogleButton from "react-google-button";

const Login = () => {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        email: '',
        password: '',
        isSignedIn: 'false',
    });
    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault()
        if(!values.isSignedIn) {
            setValues((prev) => ({ ...prev, isSignedIn: true }));
            await signInUser(values.email, values.password);
        }
    }

    const handleGoogleSignIn = (event)=> {
        event.preventDefault()
        if(!values.isSignedIn) {
            setValues(true)
            googleSignin().catch(err =>{
                setValues(false)
            })
        }
    }

    return (
        <div className='login'>
            <div className='login-form'>
                <form action='' onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className='input'>
                        <input 
                            type='email' 
                            placeholder='Email' 
                            onChange={handleInput} 
                            name='email' 
                            value={values.email} 
                        />
                        {errors.email && <span className='manage-error'>{errors.email}</span>}
                    </div>
                    <div className='input'>
                        <input 
                            type='password' 
                            placeholder='Password' 
                            onChange={handleInput} 
                            name='password' 
                            value={values.password} 
                        />
                        {errors.password && <span className='manage-error'>{errors.password}</span>}
                    </div>
                    <div className='forgot-password'>
                        <a href='#'>Forgot password?</a>
                    </div>
                    <button type='submit'>
                    <Link to="/home" className="link">Login</Link>
                    </button>
                    <div className="google-btn">
          <GoogleButton
            className="g-btn"
            type="dark"
            onClick={(event) => {handleGoogleSignIn(event)}}
          />
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
}
export default Login;