import React, { useState, useEffect } from 'react';
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

    // error checks
    if (!homePrice) {
      alert('You left the Home Price field empty!');
      return;
    }
    // if (!downPayment) {
    //   alert('You left the Down Payment field empty!');
    //   return;
    // }
    if (!interestRate) {
      alert('You left the Interest Rate field empty!');
      return;
    }

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

  // cloned CalculateMortgage function for testing purposes
  const mockCalculateMortgage = (homePrice, downPayment, interestRate, loanTerm, province) => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 1200;
    const numberOfPayments = loanTerm * 12;
    const taxRate = PROVINCES_TAX_RATES[province] / 100;
    const monthlyTax = (homePrice * taxRate) / 12;

    let monthlyPrincipalAndInterest = principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments)));
    let totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTax;

    return {
      totalMonthlyPayment: parseFloat(totalMonthlyPayment.toFixed(2))
    };
  };

  // function for running regression test
  const runRegressionTests = () => {
    const testCases = [
      {
        id: '1',
        description: 'Standard 10-year mortgage in Alberta',
        data: { homePrice: 300000, downPayment: 60000, interestRate: 3.5, loanTerm: 10, province: 'Alberta' },
        expected: { totalMonthlyPayment: 2523.26 } 
      },
      {
        id: '2',
        description: '15-year mortgage in Ontario',
        data: { homePrice: 500000, downPayment: 100000, interestRate: 4.0, loanTerm: 15, province: 'Ontario' },
        expected: { totalMonthlyPayment: 3271.25 } 
      },
      {
        id: '3',
        description: '30-year mortgage in Nova Scotia',
        data: { homePrice: 200000, downPayment: 20000, interestRate: 3.0, loanTerm: 30, province: 'NovaScotia' },
        expected: { totalMonthlyPayment: 925.55 } 
      },
      {
        id: '4',
        description: '15-year mortgage in Quebec with no down payment',
        data: { homePrice: 350000, downPayment: 0, interestRate: 3.75, loanTerm: 15, province: 'Quebec' },
        expected: { totalMonthlyPayment: 2793.20 } 
      },
      {
        id: '5',
        description: '30-year mortgage in British Columbia with a large down payment',
        data: { homePrice: 600000, downPayment: 300000, interestRate: 4.25, loanTerm: 30, province: 'BritishColumbia' },
        expected: { totalMonthlyPayment: 1825.82 } 
      },
      {
        id: '6',
        description: '10-year mortgage in Manitoba',
        data: { homePrice: 400000, downPayment: 80000, interestRate: 3.25, loanTerm: 10, province: 'Manitoba' },
        expected: { totalMonthlyPayment: 3527.01 } 
      }
    ];

    testCases.forEach(testCase => {
      console.log(`Running Test Case: ${testCase.id} - ${testCase.description}`);

      const result = mockCalculateMortgage(
        testCase.data.homePrice,
        testCase.data.downPayment,
        testCase.data.interestRate,
        testCase.data.loanTerm,
        testCase.data.province
      );

      if (result.totalMonthlyPayment !== testCase.expected.totalMonthlyPayment) {
        console.error(`Test Case ${testCase.id} Failed. Expected ${testCase.expected.totalMonthlyPayment}, but got ${result.totalMonthlyPayment}`);
      } else {
        console.log(`Test Case ${testCase.id} Passed.`);
      }
    });
  };

  useEffect(() => {
    runRegressionTests();
  }, []);


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

