import React, {useEffect, useState} from 'react';
import './Calculator.css';

function Calculator() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState('HISTORY\n'); // State to store the history of calculations
    const [showHistory, setShowHistory] = useState(false); // State to control history window visibility

    const toggleHistory = () => {
        setShowHistory(!showHistory); // Toggle the visibility of the history window
    };

    const clearHistory = () => {
        setHistory('HISTORY\n'); // Resets the history to the default state
    };

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
        if (input.trim() === '') {
            // If there's no input, don't do anything
            return;
        }

        try {
            let result = Function('"use strict";return (' + input + ')')().toString();
            setInput(result);
            // Update the history state to include the new calculation
            setHistory(prevHistory => prevHistory + input + '=' + result + '\n');
        } catch (error) {
            setInput('Error');
        }
    };
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ignore key presses when a button is focused
            if (document.activeElement.tagName === 'BUTTON') {
                document.activeElement.blur();
            }

            if ((e.key >= '0' && e.key <= '9') || "/*-+.".includes(e.key)) {
                setInput(input.concat(e.key));
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault(); // Prevent the default action
                calculate();
            } else if (e.key === 'Backspace') {
                e.preventDefault(); // Prevent the default action
                backspace();
            } else if (e.key === 'Escape') {
                clear();
            }
        };
        // Attach the event listener
        window.addEventListener('keydown', handleKeyPress);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [input]); // The effect depends on the 'input' state

    return (
        <div className="calculator-container">
            <div className={`history-window ${showHistory ? 'show' : ''}`}>
                {/* Use the history state as the value for the textarea */}
                <button onClick={clearHistory} className="clear-history">Clear History</button>
                <textarea readOnly value={history}/>
            </div>
            <div className="calculator-widget">
                <form>
                    <input type="text" value={input} data-testid="calculator-display" onChange={handleInputChange}/>

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
                    <button onClick={toggleHistory} id="toggleHistory">Hist</button>

                </div>
            </div>
        </div>
    );
}

export default Calculator;

