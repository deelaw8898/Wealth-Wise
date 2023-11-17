import React from "react";
import './nav.css';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar">
            {/* Top row for brand and auth links */}
            <div className="top-row">
                <span className="navbar-brand">WealthWise</span>
                <div className="auth-links">
                    <Link to='/login' className="nav-item nav-link auth">Login</Link>
                    <Link to='/registration' className="nav-item nav-link auth special">Join us</Link>
                </div>
            </div>

            {/* Bottom row for navigation buttons */}
            <div className="navbar-nav">
                <Link to='/' className="nav-item nav-link">Home</Link>
                <Link to='/mortgage' className="nav-item nav-link">Mortgage Calculator</Link>
                <Link to='/car' className="nav-item nav-link">Car Payment</Link>
                <Link to='/debt' className="nav-item nav-link">Debt Calculator</Link>
                <Link to='/luxury' className="nav-item nav-link">Luxury Spending</Link>
                <Link to='/vacation' className="nav-item nav-link">Vacation Spending</Link>
                <Link to='/tracker' className="nav-item nav-link">Spending</Link>
            </div>
        </nav>
    );
}

export default Nav;
