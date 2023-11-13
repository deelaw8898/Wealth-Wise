import React, { useState } from 'react';
import axios from 'axios';
import './registration.css';

function RegistrationPage() {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/register', userData);
            console.log(response.data);
            alert('Registration successful');
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                />
                <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <button type="submit">Register</button>
            </form>
        </div>
    
    );
}

export default RegistrationPage;
