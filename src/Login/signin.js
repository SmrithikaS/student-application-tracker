import React, { useState } from 'react';
import './signin.css';
import { Link, Route, useNavigate} from 'react-router-dom';
import { createUser } from '../Firebase/auth';

const Signup = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
        const [values, setValues] = useState({
            username:'',
            email: '',
            password: '',
            isRegister: false,
        });
        const handleInput = (event) => {
            setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        };
        const handleSubmit = async (event) => {
                event.preventDefault()
                if(!values.isRegister) {
                    setValues((prev) => ({ ...prev, isRegister: true }));
                    await createUser(values.email, values.password);
                const response = await fetch("http://18.211.153.46:8080/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: values.username, 
                        email: values.email,
                        password: values.password, 
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    alert("User registered successfully!");
                    navigate("/"); 
                } else {
                    alert(data.error || "Failed to register user");
                    setValues((prev) => ({ ...prev, isRegister: false }));
                }
            } 
        }
            return (
                <div className='register'>
                    <div className='register-form'>
                        <form action='' onSubmit={handleSubmit}>
                            <h1>Register</h1>
                            <div className='input'>
                                <input type='text' placeholder='Username' name='username' onChange={handleInput} />
                                {errors.name && <span className='manage-error'>{errors.name}</span>}
                            </div>
                            <div className='input'>
                                <input type='email' placeholder='Email' name='email' onChange={handleInput} />
                                {errors.email && <span className='manage-error'>{errors.email}</span>}
                            </div>
                            <div className='input'>
                                <input type='password' placeholder='Create Password' name='password' onChange={handleInput} />
                                {errors.password && <span className='manage-error'>{errors.password}</span>}
                            </div>
                            <button type='submit'>Register</button>
                            <div className='login-link'>
                                <p>Already have an account?{' '}
                                    <Link to="/" className="link">Login</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            );
};

export default Signup
