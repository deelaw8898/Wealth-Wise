import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import './mortgage.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

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
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState(10);
  const [province, setProvince] = useState('Alberta');
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [pieChartData, setPieChartData] = useState({
    labels: ['Principal', 'Interest', 'Taxes'],
    datasets: [
      {
        label: 'Mortgage Composition',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const handleHomePriceChange = (e) => {
    setHomePrice(Math.max(0, Number(e.target.value)));
  };

  const handleDownPaymentChange = (e) => {
    setDownPayment(Math.max(0, Number(e.target.value)));
  };

  const handleInterestRateChange = (e) => {
    setInterestRate(Math.max(0, Number(e.target.value)));
  };

  const calculateMortgage = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 1200;
    const numberOfPayments = loanTerm * 12;
    const taxRate = PROVINCES_TAX_RATES[province] / 100;
    const monthlyTax = (homePrice * taxRate) / 12;

    let monthlyPrincipalAndInterest = principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments)));
    let totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTax;

    setMonthlyPayment(totalMonthlyPayment.toFixed(2));

    setPieChartData({
      ...pieChartData,
      datasets: [
        {
          ...pieChartData.datasets[0],
          data: [principal / numberOfPayments, monthlyPrincipalAndInterest - (principal / numberOfPayments), monthlyTax],
        },
      ],
    });
  };

  return (
    <div className='page-scroller'>
      <div className='mortgage-calculator'>
        <label>
          Home Price:
          <input type="number" value={homePrice} onChange={handleHomePriceChange} placeholder="Enter home price" />
        </label>
        <br />

        <label>
          Down Payment:
          <input type="number" value={downPayment} onChange={handleDownPaymentChange} placeholder="Enter down payment" />

        </label>
        <br />

        <label>
          Interest Rate (%):
          <input type="number" value={interestRate} onChange={handleInterestRateChange} placeholder="Enter interest rate" />

        </label>
        <br />

        <label>
          Loan Term:
          <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}>
            <option value={10}>10 Year Fixed</option>
            <option value={15}>15 Year Fixed</option>
            <option value={30}>30 Year Fixed</option>
          </select>
        </label>
        <br />

        <label>
          Province:
          <select value={province} onChange={(e) => setProvince(e.target.value)}>
            {Object.keys(PROVINCES_TAX_RATES).map((p) => (
              <option key={p} value={p}>
                {p.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>
        </label>
        <br />

        <button onClick={calculateMortgage}>Calculate</button>
        <h3>Monthly Payment: ${monthlyPayment}</h3>
        <Pie data={pieChartData} />
      </div>
    </div>
  );
}

export default MortgageCalculator;

