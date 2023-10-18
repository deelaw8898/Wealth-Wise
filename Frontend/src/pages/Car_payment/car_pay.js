import React, { useState } from 'react'; 
import './car_pay.css';

function Car(){
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [vehiclePrice, setVehiclePrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [provincialTax, setProvincialTax] = useState('none');
  const [loanDuration, setLoanDuration] = useState(12);
  const [durationType, setDurationType] = useState('months');
  const [currentVehicleValue, setCurrentVehicleValue] = useState(0);
  const [registrationFees, setRegistrationFees] = useState(0);
  const [estimatedPayment, setEstimatedPayment] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalNumberOfPayments, setTotalNumberOfPayments] = useState(0);
  const [totalSalesTax, setTotalSalesTax] = useState(0);

  // const validateInput = (value) => {
  //   if (value < 0) {
  //     alert("Value cannot be negative");
  //     return 0;
  //   }
  //   return value;
  // };

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

    // Convert NaN to 0 where necessary
    const finalPayment = isNaN(payment) ? 0 : payment;
    const finalTotalAmountToRepay = isNaN(totalAmountToRepay) ? 0 : totalAmountToRepay;
    const finalTotalInterest = isNaN(totalInterest) ? 0 : totalInterest;

    setEstimatedPayment(Math.round(finalPayment * 100) / 100);  // Rounds to 2 decimal places

    // Set the summary values
    setTotalPayments(Math.round(finalTotalAmountToRepay * 100) / 100);
    setTotalInterest(Math.round(finalTotalInterest * 100) / 100);
    setTotalNumberOfPayments(isNaN(numberOfPayments) ? 0 : numberOfPayments);
    setTotalSalesTax(Math.round((isNaN(adjustedVehiclePrice - vehiclePrice) ? 0 : (adjustedVehiclePrice - vehiclePrice)) * 100) / 100);

    if (vehiclePrice === 0) {
      alert("You forgot to enter the New Vehicle Price!");
      setTotalNumberOfPayments(0);
      return;
    }

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
    setTotalPayments(0);
    setTotalInterest(0);
    setTotalNumberOfPayments(0);
    setTotalSalesTax(0);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

   return (
    <div className="CarPaymentCalculatorPage">
      <div className="CarPaymentCalculatorPage">
        <h1>Car Payment Calculator</h1>
        
        <div>
          <label>
            New Vehicle Price: &nbsp;
            <input type="number" value={vehiclePrice} onChange={e => setVehiclePrice(parseFloat(e.target.value))} />
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Current Vehicle Value (Optional): &nbsp;
            <input type="number" value={currentVehicleValue} onChange={e => setCurrentVehicleValue(parseFloat(e.target.value))} />
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Down Payment (Optional): &nbsp;
            <input type="number" value={downPayment} onChange={e => setDownPayment(parseFloat(e.target.value))} />
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Duration of Loan: &nbsp;
            <input type="number" value={loanDuration} onChange={e => setLoanDuration(parseFloat(e.target.value))} />
            <select value={durationType} onChange={e => setDurationType(e.target.value)}>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Interest Rate (%): &nbsp;
            <input type="number" value={interestRate} onChange={e => setInterestRate(parseFloat(e.target.value))} />
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Provincial Sales Tax: &nbsp;
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
        <br></br>
        <div>
          <label>
            Registration & Other Fees (Optional): &nbsp;
            <input type="number" value={registrationFees} onChange={e => setRegistrationFees(parseFloat(e.target.value))} />
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Payment Frequency: &nbsp;
            <select value={paymentFrequency} onChange={e => setPaymentFrequency(e.target.value)}>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>
        <br></br>
        <button onClick={calculatePayment} style={{marginRight: "10px"}}>Calculate</button> 
        <button onClick={resetInputs}>Reset</button>
        
        <div className="summary-section">
          <h2>Summary</h2>
          <div>Estimated Payment: ${numberWithCommas((isNaN(estimatedPayment) ? 0 : estimatedPayment).toFixed(2))}</div>
          <div>Total Payments: ${numberWithCommas((isNaN(totalPayments) ? 0 : totalPayments).toFixed(2))}</div>
          <div>Total Interest: ${numberWithCommas((isNaN(totalInterest) ? 0 : totalInterest).toFixed(2))}</div>
          <div>Total Number of Payments: {isNaN(totalNumberOfPayments) ? 0 : totalNumberOfPayments}</div>
          <div>Total Sales Tax: ${numberWithCommas((isNaN(totalSalesTax) ? 0 : totalSalesTax).toFixed(2))}</div>
        </div>
      </div>
    </div>
  );
}

export default Car;
