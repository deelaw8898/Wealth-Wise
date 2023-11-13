import React, { useState } from "react";
import './login.css'
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="Login">
            <h2>Login</h2>
            <br></br>
            <form className="login-form" onSubmit={handleSubmit}>
                <label className = "email" for="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <br></br>
                <label className ="password" for="password">password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <br></br>
                <button type= "submit" id='Login-button'>Log In</button>
            </form>
        </div>

    );
}
export default Login;