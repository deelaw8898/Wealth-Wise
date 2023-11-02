import React, { useState, useRef } from 'react'; 
import './car_pay.css';

function Car(){
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [vehiclePrice, setVehiclePrice] = useState(null);
  const [downPayment, setDownPayment] = useState(null);
  const [interestRate, setInterestRate] = useState(null);
  const [provincialTax, setProvincialTax] = useState('none');
  const [loanDuration, setLoanDuration] = useState(null);
  const [durationType, setDurationType] = useState('months');
  const [currentVehicleValue, setCurrentVehicleValue] = useState(null);
  const [registrationFees, setRegistrationFees] = useState(null);
  const [estimatedPayment, setEstimatedPayment] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalNumberOfPayments, setTotalNumberOfPayments] = useState(0);
  const [totalSalesTax, setTotalSalesTax] = useState(0);

  //creating ref for summary section
  const summaryRef = useRef(null);

  //New reference for top section
  const topSectionRef = useRef(null);

  const calculatePayment = () => {

    // Check for vehicle price
    if (!vehiclePrice || vehiclePrice === 0) {
      alert("You forgot to enter the New Vehicle Price!");
      setTotalNumberOfPayments(0);
      return;
    }
    //Check for duration of loan
    else if (!loanDuration || loanDuration === 0) {
      alert("You forgot to enter the Duration of Loan!")
      return;
    }
    //Check for interest rate
    else if (interestRate === null || isNaN(interestRate) || interestRate === "") {
      alert("Please enter an amount (or 0) for the Interest Rate!")
      return;
    }
    // Check for current vehicle value
    else if (currentVehicleValue === null || isNaN(currentVehicleValue) || currentVehicleValue === "") {
      alert("Please enter an amount (or 0) for the Current Vehicle Value.");
      return;
    }
    // Check for down payment
    else if (downPayment === null || isNaN(downPayment) || downPayment === "") {
      alert("Please enter an amount (or 0) for the Down Payment.");
      return;
    }
    // Check for registration & other fees
    else if (registrationFees === null || isNaN(registrationFees) || registrationFees === "") {
      alert("Please enter an amount (or 0) for Registration & Other Fees.");
      return;
    }

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

    //Scroll down to summary section
    summaryRef.current.scrollIntoView({ behavior: 'smooth'});
  };

  const resetInputs = () => {
    setPaymentFrequency('monthly');
    setVehiclePrice("");
    setDownPayment("");
    setInterestRate("");
    setProvincialTax('none');
    setLoanDuration("");
    setDurationType('months');
    setCurrentVehicleValue("");
    setRegistrationFees("");
    setEstimatedPayment(0);
    setTotalPayments(0);
    setTotalInterest(0);
    setTotalNumberOfPayments(0);
    setTotalSalesTax(0);

    //Scroll back up
    topSectionRef.current.scrollIntoView({ behavior: 'smooth'});
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

   return (
    <div className="CarPaymentCalculatorPage" ref={topSectionRef}>
      <div className="CarPaymentCalculatorPage">
        <br></br>
        <br></br>
        <div>
          <label>
            New Vehicle Price: &nbsp;
            <input type="number" min = "0" value={vehiclePrice} onChange={e => setVehiclePrice(parseFloat(e.target.value))} />
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Current Vehicle Value (Optional): &nbsp;
            <input type="number" min = "0" value={currentVehicleValue} onChange={e => setCurrentVehicleValue(parseFloat(e.target.value))} />
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Down Payment (Optional): &nbsp;
            <input type="number" min = "0" value={downPayment} onChange={e => setDownPayment(parseFloat(e.target.value))} />
          </label>
        </div>
        <br></br>
        <div>
          <label>
            Duration of Loan: &nbsp;
            <input type="number" min = "0" value={loanDuration} onChange={e => setLoanDuration(parseFloat(e.target.value))} />
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
            <input type="number" min = "0" value={interestRate} onChange={e => setInterestRate(parseFloat(e.target.value))} />
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
            <input type="number" min = "0" value={registrationFees} onChange={e => setRegistrationFees(parseFloat(e.target.value))} />
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
        
        <div className="summary-section" ref={summaryRef}>
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
