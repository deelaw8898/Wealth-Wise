import React, { useState } from 'react';
import './mortgage.css'

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
    <div>
      <label>
        Home Price:
        <input type="number" value={homePrice} onChange={e => setHomePrice(Number(e.target.value))} />
      </label>
      <br />

      <label>
        Down Payment:
        <input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
      </label>
      <br />

      <label>
        Interest Rate (%):
        <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} />
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
            <option key={p} value={p}>{p}</option>
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
