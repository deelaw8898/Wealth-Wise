import React, { useState } from 'react';
import './car_pay.css';

function App() {
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [vehiclePrice, setVehiclePrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [provincialTax, setProvincialTax] = useState('none');
  const [loanDuration, setLoanDuration] = useState(12);
  const [durationType, setDurationType] = useState('months');
  const [currentVehicleValue, setCurrentVehicleValue] = useState(0);
  const [registrationFees, setRegistrationFees] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [estimatedPayment, setEstimatedPayment] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalNumberOfPayments, setTotalNumberOfPayments] = useState(0);
  const [totalSalesTax, setTotalSalesTax] = useState(0);

  const validateInput = (value) => {
    if (value < 0) {
      alert("Value cannot be negative");
      return 0;
    }
    return value;
  };

  const calculatePayment = () => {
    // 1. Adjust the vehiclePrice for provincial tax
    let adjustedVehiclePrice = vehiclePrice;
    switch (provincialTax) {
        case 'AB': adjustedVehiclePrice *= 1.05; break; // 5% GST
        case 'BC': adjustedVehiclePrice *= 1.12; break; // 5% GST + 7% PST
        case 'MB': adjustedVehiclePrice *= 1.13; break; // 5% GST + 8% PST
        case 'NB': adjustedVehiclePrice *= 1.15; break; // 5% GST + 10% HST
        case 'NL': adjustedVehiclePrice *= 1.15; break; // 5% GST + 10% HST
        case 'NS': adjustedVehiclePrice *= 1.15; break; // 5% GST + 10% HST
        case 'ON': adjustedVehiclePrice *= 1.13; break; // 5% GST + 8% HST
        case 'PE': adjustedVehiclePrice *= 1.15; break; // 5% GST + 10% HST
        case 'QC': adjustedVehiclePrice *= 1.14975; break; // 5% GST + 9.975% QST
        case 'SK': adjustedVehiclePrice *= 1.11; break; // 5% GST + 6% PST
        default: break;
    }

    // 2. Deduct down payment and current vehicle value, and 3. Add registration and other fees
    const principal = parseFloat(adjustedVehiclePrice) + parseFloat(registrationFees) - parseFloat(downPayment) - parseFloat(currentVehicleValue);

    // Convert loan duration to months if it's in years
    const totalMonths = (durationType === 'years') ? loanDuration * 12 : loanDuration;

    // 4. Calculate total interest over the loan period
    const monthlyInterestRate = (interestRate / 100) / 12;
    const totalInterest = principal * monthlyInterestRate * totalMonths;

    // 5. Calculate monthly or biweekly payment
    const totalAmountToRepay = principal + totalInterest;
    const numberOfPayments = (paymentFrequency === 'biweekly') ? totalMonths * 2 : totalMonths;
    const payment = totalAmountToRepay / numberOfPayments;

    setEstimatedPayment(Math.round(payment * 100) / 100);  // Rounds to 2 decimal places

    // Set the summary values
    setTotalPayments(Math.round(totalAmountToRepay * 100) / 100);
    setTotalInterest(Math.round(totalInterest * 100) / 100);
    setTotalNumberOfPayments(numberOfPayments);
    setTotalSalesTax(Math.round((adjustedVehiclePrice - vehiclePrice) * 100) / 100);
  };

  const resetInputs = () => {
    setPaymentFrequency('monthly');
    setVehiclePrice(0);
    setDownPayment(0);
    setInterestRate(0);
    setProvincialTax('none');
    setLoanDuration(12);
    setDurationType('months');
    setCurrentVehicleValue(0);
    setRegistrationFees(0);
    setEstimatedPayment(0);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <div className="container">
        <h1>Car Payment Calculator</h1>

        <div>
          <label>
            New Vehicle Price:
            <input type="number" value={vehiclePrice} onChange={e => setVehiclePrice(validateInput(parseFloat(e.target.value)))} />
          </label>
        </div>

        <div>
          <label>
            Current Vehicle Value (Optional):
            <input type="number" value={currentVehicleValue} onChange={e => setCurrentVehicleValue(validateInput(parseFloat(e.target.value)))} />
          </label>
        </div>

        <div>
          <label>
            Down Payment (Optional):
            <input type="number" value={downPayment} onChange={e => setDownPayment(validateInput(parseFloat(e.target.value)))} />
          </label>
        </div>

        <div>
          <label>
            Duration of Loan:
            <input type="number" value={loanDuration} onChange={e => setLoanDuration(validateInput(parseFloat(e.target.value)))} />
            <select value={durationType} onChange={e => setDurationType(e.target.value)}>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Interest Rate (%):
            <input type="number" value={interestRate} onChange={e => setInterestRate(validateInput(parseFloat(e.target.value)))} />
          </label>
        </div>

        <div>
          <label>
            Provincial Sales Tax:
            <select value={provincialTax} onChange={e => setProvincialTax(e.target.value)}>
              <option value="none">None</option>
              <option value="AB">Alberta</option>
              <option value="BC">British Columbia</option>
              <option value="MB">Manitoba</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="NS">Nova Scotia</option>
              <option value="ON">Ontario</option>
              <option value="PE">Prince Edward Island</option>
              <option value="QC">Quebec</option>
              <option value="SK">Saskatchewan</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Registration & Other Fees (Optional):
            <input type="number" value={registrationFees} onChange={e => setRegistrationFees(validateInput(parseFloat(e.target.value)))} />
          </label>
        </div>

        <div>
          <label>
            Payment Frequency:
            <select value={paymentFrequency} onChange={e => setPaymentFrequency(e.target.value)}>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>

        <div className="buttons-container">
          <button onClick={calculatePayment}>Calculate</button>
          <button onClick={resetInputs}>Reset</button>
        </div>

        <div className="summary-section">
          <h2>Summary</h2>
          <div>Estimated Payment: ${numberWithCommas(estimatedPayment.toFixed(2))}</div>
          <div>Total Payments: ${numberWithCommas(totalPayments.toFixed(2))}</div>
          <div>Total Interest: ${numberWithCommas(totalInterest.toFixed(2))}</div>
          <div>Total Number of Payments: {totalNumberOfPayments}</div>
          <div>Total Sales Tax: ${numberWithCommas(totalSalesTax.toFixed(2))}</div>
        </div>

        <div className="toggle-container">
          <button onClick={() => setDarkMode(!darkMode)}>
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
