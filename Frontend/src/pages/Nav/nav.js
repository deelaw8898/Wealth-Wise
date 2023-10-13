import React from "react";
import './nav.css';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="d-flex justify-content-between w-100">
                <div>
                    <span className="navbar-brand">CompanyName</span>
                </div>
                
                <div className="auth-links">
                    <Link to='/login' className="nav-item nav-link">Login</Link>
                    <Link to='/registration' className="nav-item nav-link">Registration</Link>
                </div>

                
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMainMenu" aria-controls="NavMainMenu">
                <span className="navbar-toggler-icon"></span>
            </button>
            
            <div id="navMainMenu" className="navbar-collapse collapse">
                <div className="navbar-nav ml-auto">
                    <Link to='/' className="nav-item nav-link active">Home</Link>
                    <Link to='/mortgage' className="nav-item nav-link active">Mortgage Calculator </Link>
                    <Link to='/car' className="nav-item nav-link active">Car Payment Calculator </Link>
                    <Link to='/debt' className="nav-item nav-link active">debt Calculator </Link>
                    <Link to='/luxury' className="nav-item nav-link active">luxury spending Calculator </Link>
                    <Link to='/vacation' className="nav-item nav-link active"> Vacation spending Calculator </Link>
                    <Link to='/tracker' className="nav-item nav-link active"> Monthly Spending </Link>


                    
                    {/* <Link to='/registration' className="nav-item nav-link">Registration</Link> */}
                </div>
            </div>
        </nav>
    );
}

export default Nav;
