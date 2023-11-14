// Import necessary React components and libraries
import React, { useState } from 'react';

function Login() {
  // Define state variables to store username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Send a POST request to your server to authenticate the user
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

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
