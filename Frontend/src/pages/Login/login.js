import React, { useState } from 'react';
import axios from 'axios'; // Import axios here

function Login() {
  // Define state variables to store username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
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
        // Redirect the user to the dashboard or another page
        // You can use React Router for navigation
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
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
