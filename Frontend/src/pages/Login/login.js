import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import './login.css';


function Login({onLogin}) {
  // Define state variables to store username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
    };

    try {
      const response = await axios.post('http://localhost:4000/login', userData);

      if (response.status === 200) {
        setMessage('Login successful');
        onLogin(true, username);
        navigate('/tracker');
      } else {
        setMessage('Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error logging in');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className='usernameLogin'>
          <h2>Username</h2>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='passwordLogin'>
          <h2>password</h2>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="submit" type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
