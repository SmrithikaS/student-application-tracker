import React, { useState } from 'react';
import './signin.css';
import { Link, Route, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/auth';
import { createUser } from '../Firebase/auth';

const Signup = () => {
    const navigate = useNavigate();
    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };
    const [errors, setErrors] = useState({});
        const [values, setValues] = useState({
            email: '',
            password: '',
            isRegister: 'false',
        });
        const handleSubmit = async (event) => {
                event.preventDefault()
                if(!values.isRegister) {
                    setValues((prev) => ({ ...prev, isRegister: true }));
                    await createUser(values.email, values.password);
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
                                    <a><Link to="/" className="link">Login</Link></a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            );
};

export default Signup
