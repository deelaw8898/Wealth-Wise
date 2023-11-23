import './App.css';

import Nav from './pages/Nav/nav';
import Home from './pages/Home/home'; 
import Login  from './pages/Login/login';
import Registration from './pages/Registration/registration';
import Mortgage from './pages/Mortgage_cal/mortgage';
import Car from './pages/Car_payment/car_pay';
import Debt from './pages/Debt_cal/debt';
import Luxury from './pages/luxury_spending/luxury';
import Vacation from './pages/Vacation_Spending/vacation';
import MonthlyCalculator from './pages/MonthlyCalculator/MonthlyCalculator';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalculatorButton from "./pages/Calculator/CalculatorButton";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Nav />
          <CalculatorButton />
          {/* this will route us to the page */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={< Registration/>} />
            <Route path="/mortgage" element={< Mortgage/>} />
            <Route path="/car" element={< Car/>} />
            <Route path="/debt" element={<Debt/>} />
            <Route path="/luxury" element={<Luxury/>} />
            <Route path="/vacation" element={< Vacation/>} />
            <Route path="/tracker" element={< MonthlyCalculator/>} />
            
            
            {/*<Route path="/" element={< />} /> */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
