import React from "react";
import { useState } from "react";
import "./registration.css";

function Registration() {

    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [income, setIncome] = useState('');

    function registerUser() {
        var inputs = document.querySelectorAll("#regForm input[required]")
        var flag = false;

        for (var x = 0; x < inputs.length; x++) {
            if (!inputs[x].value) {
                inputs[x].style.border = "2px solid red";
                flag = true;
            }

            else {
                inputs[x].style.border = "2px solid white";
            }
        }

        if (flag) {
            alert("Please fill in all required fields.");
            return;
        }

        if (income === "") {
            fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            .then(response => {
                if (!response.ok) {
                    alert("Username is not unique!");
                    setUsername('');
                    return;
                }
                
                else { alert("User registered successfully!");}
            })
        }

        else {
            fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, income }),
            })
            
            .then(response => {
                if (!response.ok) {
                    alert("Username is not unique!");
                    setUsername('');
                    return;
                }
                
                else { alert("User registered successfully!");}
            })
        }
    };

    function validateNumber(value) {
        if (isNaN(value)) {
            alert("Please enter a valid number.");
            value = "";
            return false;
        }

        else if (value < 0) {
            alert("Please enter a number greater than 0.");
            value = "";
            return false;
        }

        else if (value === "") {
            return false;
        }

        return true;
    }

    return(
        <section>
            <div id="registrationPage">
                <h1>Registration</h1>
                    <form id="regForm">
                        <label for="username">Username*</label><br></br>
                        <input type="text" id="username" name="username" value={username} placeholder="Enter username..." required
                        onChange={(e) => setUsername(e.target.value)}></input><br></br><br></br>

                        <label for="password">Password*</label><br></br>
                        <input type="text" id="password" name="password" value={password} placeholder="Enter password..." required
                        onChange={(e) => setPassword(e.target.value)}></input><br></br><br></br>

                        <label for="income">Income (Monthly)</label><br></br>
                        <input type="number" id="income" name="income" value={income} 
                        onChange={(e) => setIncome(parseFloat(e.target.value))} 
                        onBlur={(e) => {if (validateNumber(e.target.value)) setIncome(parseFloat(e.target.value).toFixed(2))
                                        else setIncome('')}}
                        placeholder="Enter monthly income..." min="0"></input><br></br><br></br>

                        <button type="button" onClick={registerUser}>Register</button><br></br>

                        <br></br>

                        <p>Fields marked with a * are mandatory for registration.</p>
                    </form>
            </div>
        </section>
    );
}

export default Registration;