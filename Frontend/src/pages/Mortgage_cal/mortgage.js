import React, { useState } from 'react';
import './mortgage.css';

const PROVINCES_TAX_RATES = {
  Alberta: 0.6,
  BritishColumbia: 0.7,
  Manitoba: 1.2,
  NewBrunswick: 0.9,
  NewfoundlandAndLabrador: 0.8,
  NovaScotia: 1.0,
  Ontario: 0.75,
  PrinceEdwardIsland: 0.7,
  Quebec: 0.85,
  Saskatchewan: 0.95,
};

function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(10);
  const [province, setProvince] = useState("Alberta");
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const handleHomePriceChange = (e) => {
    const value = Math.max(0, Number(e.target.value));
    setHomePrice(value);
  };

  const handleDownPaymentChange = (e) => {
    const value = Math.max(0, Number(e.target.value));
    setDownPayment(value);
  };

  const handleInterestRateChange = (e) => {
    const value = Math.max(0, Number(e.target.value));
    setInterestRate(value);
  };

  const calculateMortgage = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 1200;
    const numberOfPayments = loanTerm * 12;
    const taxRate = PROVINCES_TAX_RATES[province] / 100;

    let payment = principal * (monthlyRate / (1 - Math.pow((1 + monthlyRate), -numberOfPayments)));
    payment += (homePrice * taxRate) / 12;  // Adding monthly property tax
    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <div className='mortgage-calculator'>
      <label>
        Home Price:
        <input type="number" value={homePrice} onChange={handleHomePriceChange} />
      </label>
      <br />

      <label>
        Down Payment:
        <input type="number" value={downPayment} onChange={handleDownPaymentChange} />
      </label>
      <br />

      <label>
        Interest Rate (%):
        <input type="number" value={interestRate} onChange={handleInterestRateChange} />
      </label>
      <br />

      <label>
        Loan Term:
        <select value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}>
          <option value={10}>10 Year Fixed</option>
          <option value={15}>15 Year Fixed</option>
          <option value={30}>30 Year Fixed</option>
        </select>
      </label>
      <br />

      <label>
        Province:
        <select value={province} onChange={e => setProvince(e.target.value)}>
          {Object.keys(PROVINCES_TAX_RATES).map(p => (
            <option key={p} value={p}>{p.replace(/([A-Z])/g, ' $1').trim()}</option>
          ))}
        </select>
      </label>
      <br />

      <button onClick={calculateMortgage}>Calculate</button>
      <h3>Monthly Payment: ${monthlyPayment}</h3>
    </div>
  );
}

export default MortgageCalculator;
