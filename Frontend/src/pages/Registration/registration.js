import React, { useState } from 'react';
import axios from 'axios';
import './registration.css';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/register', userData);
            console.log(response.data);
            alert('Registration successful');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        }
    };

    return (
        <div className='Registration'>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>

                <h2>Username</h2>
                <input
                    className='username'
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <h2>password</h2>
                <input
                    className='password'
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <h2>First name</h2>
                <input
                    className='firstName'

                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                />
                <h2>Last name</h2>
                <input
                    className='lastName'
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                <h2>Email</h2>
                <input
                    className='email'
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <button className="submit " type="submit">Register</button>
            </form>
        </div>
    
    );
}

export default RegistrationPage;
