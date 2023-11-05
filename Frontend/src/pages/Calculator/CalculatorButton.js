// CalculatorButton.js
import React, { useState } from 'react';
import Calculator from './Calculator';
import './CalculatorButton.css'; // make sure to create appropriate CSS for this

function CalculatorButton() {
    const [isCalculatorOpen, setCalculatorOpen] = useState(false);

    const toggleCalculator = () => {
        setCalculatorOpen(!isCalculatorOpen);
    };

    return (
        <div className="calculator-button-container">
            <button onClick={toggleCalculator} className="calculator-toggle">
                {/* Here you can put an icon or any symbol you like to represent the calculator */}
                Calc
            </button>

            {isCalculatorOpen && <Calculator />}
        </div>
    );
}

export default CalculatorButton;
