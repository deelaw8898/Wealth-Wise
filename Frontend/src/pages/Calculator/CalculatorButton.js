// CalculatorButton.js
import React, { useState } from 'react';
import Calculator from './Calculator';
import './CalculatorButton.css';

function CalculatorButton() {
    const [isCalculatorOpen, setCalculatorOpen] = useState(false);

    const toggleCalculator = () => {
        setCalculatorOpen(!isCalculatorOpen);
    };

    return (
        <div className="calculator-button-container">
            <button onClick={toggleCalculator} className="calculator-toggle">
                Calc
            </button>

            {isCalculatorOpen && <Calculator />}
        </div>
    );
}

export default CalculatorButton;

