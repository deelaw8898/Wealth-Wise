import React, {useEffect, useState} from 'react';
import './Calculator.css'; // You would need to create a corresponding CSS file for styling

function Calculator() {
    const [input, setInput] = useState('');

    const handleClick = (e) => {
        setInput(input.concat(e.target.name));
    }

    const clear = () => {
        setInput('');
    }

    const backspace = () => {
        setInput(input.slice(0, -1));
    }

    const calculate = () => {
        try {
            // Use new Function constructor instead of eval for better security practices
            setInput(Function('"use strict";return (' + input + ')')().toString());
        } catch (error) {
            setInput('Error');
        }
    }

    useEffect(() => {
        // Attach the event listener
        window.addEventListener('keydown', handleKeyPress);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [input]); // The effect depends on the 'input' state

    const handleKeyPress = (e) => {
        // Check if the key is a number, an operator, or other allowed keys
        if ((e.key >= '0' && e.key <= '9') || "/*-+.".includes(e.key)) {
            setInput(input.concat(e.key));
        } else if (e.key === 'Enter' || e.key === '=') {
            calculate();
        } else if (e.key === 'Backspace') {
            backspace();
        } else if (e.key === 'Escape') {
            clear();
        }
    };

    return (
        <div className="calculator-widget">
            <form>
                <input type="text" value={input} />

            </form>
            <div className="keypad">

                <button onClick={clear} id="clear">AC</button>
                <button onClick={backspace} id="backspace">DE</button>
                <button name="." onClick={handleClick}>.</button>
                <button name="/" onClick={handleClick}>&divide;</button>
                <button name="7" onClick={handleClick}>7</button>
                <button name="8" onClick={handleClick}>8</button>
                <button name="9" onClick={handleClick}>9</button>
                <button name="*" onClick={handleClick}>&times;</button>
                <button name="4" onClick={handleClick}>4</button>
                <button name="5" onClick={handleClick}>5</button>
                <button name="6" onClick={handleClick}>6</button>
                <button name="-" onClick={handleClick}>&ndash;</button>
                <button name="1" onClick={handleClick}>1</button>
                <button name="2" onClick={handleClick}>2</button>
                <button name="3" onClick={handleClick}>3</button>
                <button name="+" onClick={handleClick}>+</button>
                <button name="0" onClick={handleClick}>0</button>
                <button onClick={calculate} id="result">=</button>

            </div>
        </div>
    );
}

export default Calculator;
