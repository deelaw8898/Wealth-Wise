import React, { useState } from 'react';
import Calculator from './Calculator';
import './CalculatorButton.css';
import calcIcon from './icon_calculator.png';

function CalculatorButton() {
    const [isCalculatorOpen, setCalculatorOpen] = useState(false);

    const toggleCalculator = () => {
        setCalculatorOpen(!isCalculatorOpen);
    };

    return (
        <div className="calculator-button-container">
            <button onClick={toggleCalculator} className="calculator-toggle">
                <img src={calcIcon} alt="Calculator" className="calculator-icon"/>
            </button>

            {isCalculatorOpen && <Calculator />}
        </div>
    );
}

export default CalculatorButton;
