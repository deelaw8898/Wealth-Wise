import React, { useEffect } from "react";
import { useState } from "react";
import { Chart } from "react-google-charts";
import './debt.css';

/**
 * This is the page wherein the debt calculator functions are stored. There are two separate
 * calculators with separate fields and separate calculations. The first calculator is for
 * calculating the monthly payment required to be debt free by a certain date, while the second
 * calculator is for calculating the interest savings from making a lump sum payment today.
 */
function Debt() {
    // All these variables are either input variable or output variable from the calculator
    // that calculates the required monthly payment to be debt free by a certain date.

    const [testState, setTestState] = useState(true);          // Used for testing purposes

    // VARIABLES FOR INPUT FIELDS
    const [debt1, setDebt1] = useState('');                     // Total amount owing
    const [interest1, setInterest1] = useState('');             // Annual interest rate as a percent
    const [surplusIncome, setSurplusIncome] = useState('');     // Average monthly surplus income
    const [date, setDate] = useState('');                       // Desired debt-free date

    // VARIABLES FOR OUTPUT FIELD
    const [monthlyPayment, setMonthlyPayment] = useState('');   // Field wherein output is displayed

    // VARIABLES FOR FUNCTION USE
    const [startDate, setStartDate] = useState('');                     // Start date for the graph
    const [targetDate, setTargetDate] = useState('');                   // Target end date for the graph
    const [debt, setDebt] = useState(0);                                // Total amount owing
    const [interest, setInterest] = useState(0);                        // Annual interest rate as a percent
    const [surplus, setSurplus] = useState(0);   
    const [monthlyInterest, setMonthlyInterest] = useState(0);                     // Average monthly surplus income
    const [reqPayment, setReqPayment] = useState(0);                                // Required monthly payment to be debt free by the desired date  
    const [affordablePayment, setAffordablePayment] = useState(0);                  // Affordable payment (if it exists)
    const [monthsToPay, setMonthsToPay] = useState(0);                              // Months to pay off debt
    const [debtFreeBy, setDebtFreeBy] = useState('');
    const [textReady, setTextReady] = useState(false);                              // Whether the text is ready to be displayed
    const [graphReady, setGraphReady] = useState(false);                            // Whether the graph is ready to be displayed
    const [data, setData] = useState([]);                                           // Data for the chart
    const [options, setOptions] = useState([]);                                     // Options for the chart
    const [chartAvailable, setChartAvailable] = useState(false);                    // Whether the chart is available
    const [monPayReady, setMonPayReady] = useState(false);                          // Whether the monthly payment is ready to be calculated

    function validateMonthlyPayment() {
        setMonthlyPayment('');
        setChartAvailable(false);
        setTextReady(false);
        setGraphReady(false);
        setMonPayReady(false);
        setStartDate('');
        setTargetDate('');
        setDebt(0);
        setInterest(0);
        setSurplus(0);
        setMonthlyInterest(0);
        setReqPayment(0);
        setAffordablePayment(0);
        setMonthsToPay(0);
        setDebtFreeBy('');

        console.log("Inside validateMonthlyPayment...");
        setChartAvailable(false);
        var inputs = document.querySelectorAll("#DebtCalc1 input[required]")
        var flag = false;

        // Checks each input to ensure it is filled out properly. If not, the flag is set to true and
        // that input field is highlighted with a red border. After that, an alert is displayed to the
        // user to fill out all fields properly before returning false to abort the calculation. If the 
        // inputs are valid, the border is set to be normal.
        for (var x = 0; x < inputs.length; x++) {
            if (!inputs[x].value) {
                inputs[x].style.border = "2px solid red";
                flag = true;
            }

            else {
                inputs[x].style.border = "2px solid white";
            }
        }

        // If the flag is true, then an alert is displayed to the user to fill out all fields properly before returning
        // false to abort the calculation.
        if (flag) {
            alert("Please fill out all fields for the Monthly Payment Calculator.");
            setMonthlyPayment("");
            return false;
        }

        if (validateDate(date) === false) {
            alert("Please enter a date at least one month in the future.");
            setMonthlyPayment("");
            return false;
        }

        setStartDate(new Date().toISOString().split('T')[0]);
        setTargetDate(date);
        setDebt(parseFloat(debt1));
        setInterest(parseFloat(interest1) / 100);
        setSurplus(parseFloat(surplusIncome));
        setMonPayReady(true);
        console.log("Ending...");
    }

    /**
     * The current function calculates the required monthly payment using the following formula:
     * ((365.25 / 12) * (debt / ((1 - (1 + dailyInterest) ** -(days)) / dailyInterest))).
     * The formula first computes the average number of days per month (365.25 / 12) and then
     * multiplies that by the debt divided by the annuity factor. The annuity factor is calculated
     * by dividing the total amount by the difference between 1 and the daily interest rate to the
     * power of the amount of days until the desired debt free date. This annuity factor is then
     * divided by the dailly interest rate to get the required monthly payment. Then, the output
     * field is updated to display the information to the user.
     */
    useEffect(() => {
        if (monPayReady) {
            setMonPayReady(false);
            console.log("Inside useEffect for monthly payment...");

            // Gets the current date and time and the desired debt free date and calculates the difference
            // between the two dates in months.
            const now = new Date(Date.UTC(startDate.substring(0, 4), startDate.substring(5, 7) - 1, startDate.substring(8, 10)));
            const then = new Date(Date.UTC(targetDate.substring(0, 4), targetDate.substring(5, 7) - 1, targetDate.substring(8, 10)));
            let months = (then.getUTCFullYear() - now.getUTCFullYear()) * 12 + (then.getUTCMonth() - now.getUTCMonth());

            if (then.getUTCDate() > new Date(then.getUTCFullYear(), then.getUTCMonth() + 1, 0).getUTCDate()) {
                const remainingDaysInMonth = new Date(then.getUTCFullYear(), then.getUTCMonth() + 1, 0).getUTCDate() - now.getUTCDate() + 1;
                months += 1 + Math.floor(remainingDaysInMonth / new Date(then.getUTCFullYear(), then.getUTCMonth() + 1, 0).getUTCDate());
            }

            // Gets the total amount owing, the annual interest rate, and calculates the required monthly payment to
            // be debt free by the desired date.
            const monthlyInterestRate = interest / 12;
            setMonthlyInterest(monthlyInterestRate);
            let monthlyPaymentCalc = 0;
            if (monthlyInterestRate > 0) monthlyPaymentCalc = ((debt * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months))).toFixed(2);
            else monthlyPaymentCalc = (debt / months).toFixed(2);

            // Calculates the difference between the required monthly payment and the surplus income. If the difference
            // is greater than 0, then the user cannot afford to pay off their debt by the desired date. Else, the user
            // can afford to pay off their debt by the desired date and the output field is updated to display the
            // required monthly payment. Otherwise, the output field is updated to show how long it would take to pay off
            // the debt if the user were to pay the full amount of their surplus income every month.
            const difference = monthlyPaymentCalc - surplus;
            
            // If the required payment is not affordable, finds out how soon the debt can be paid off with the current surplus income.
            // It does this by subtracting the payment from the debt plus whatever interest accrued on a daily basis until the user has
            // paid off their debt. Each time it loops, it increments the days to pay variable which, in the end, describes to the user
            // how often they'll have to pay the prescribed amount every month to be debt free.
            if (difference > 0) {
                let monthsToPayOff = Math.ceil(Math.abs(Math.log(1 - (debt * monthlyInterestRate) / surplus) / Math.log(1 + monthlyInterestRate)));
                
                setMonthsToPay(monthsToPayOff);

                if (!isNaN(monthsToPayOff)) {
                    let newMonthlyPaymentCalc = 0;
                    if (monthlyInterestRate > 0) newMonthlyPaymentCalc = ((debt * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -monthsToPayOff))).toFixed(2);
                    else newMonthlyPaymentCalc = (debt / monthsToPayOff).toFixed(2);
                    let debtFreeBy = new Date(Date.UTC(now.getUTCFullYear() + (monthsToPayOff / 12), (now.getUTCMonth() + (monthsToPayOff % 12)) % 12, 15));

                    if (then.getUTCDate() >= 29 && debtFreeBy.getMonth() === 1 && debtFreeBy.getFullYear() % 4 === 0) debtFreeBy.setDate(29);
                    else if (then.getUTCDate() >= 28 && debtFreeBy.getMonth() === 1 && debtFreeBy.getFullYear() % 4 !== 0) debtFreeBy.setDate(28);
                    else if (then.getUTCDate() === 31 && (debtFreeBy.getMonth() === 3 || debtFreeBy.getMonth() === 5 || debtFreeBy.getMonth() === 8 || debtFreeBy.getMonth() === 10)) debtFreeBy.setDate(30);
                    else debtFreeBy.setDate(then.getDate());

                    setDebtFreeBy(debtFreeBy.toISOString().split('T')[0]);
                    setAffordablePayment(newMonthlyPaymentCalc);
                    setReqPayment(monthlyPaymentCalc);
                }
            }

            else {
                setMonthsToPay(months);
                setDebtFreeBy(then.toISOString().split('T')[0]);
                setAffordablePayment(monthlyPaymentCalc);
                setReqPayment(monthlyPaymentCalc);
            }

            setTextReady(true);
            setGraphReady(true);
        }
    }, [monPayReady, startDate, targetDate, debt, interest, surplus]);

    useEffect(() => {
        if (textReady) {
            setTextReady(false);
            if (!isNaN(monthsToPay)) {
                if (debtFreeBy !== targetDate) {
                    setMonthlyPayment("To be debt free by " + targetDate + ", you would need to pay about $" + 
                    reqPayment.toString() + " a month which is more than you can afford by about $" + (reqPayment - affordablePayment).toFixed(2).toString() + ". If you were to pay $" + 
                    affordablePayment.toString() + " a month over " + monthsToPay + " months, you would be debt free by " + debtFreeBy + ".");
                    
                }

                else {
                    setMonthlyPayment("To be debt free by " + debtFreeBy + ", you would need to pay about $" + 
                    reqPayment.toString() + " a month in " + monthsToPay.toString() + " monthly installments.");
                }
            }

            else setMonthlyPayment("You cannot afford to pay off your debt with your current surplus income.");
        }
    }, [textReady, reqPayment, affordablePayment, monthsToPay, debtFreeBy, targetDate]);

    useEffect(() => {
        if (graphReady) {
            setGraphReady(false);
            if (!isNaN(monthsToPay)) {
                let list = [];
                list.push(['Date', 'Debt']);
                let cumulativeDebt = debt;
                list.push([startDate, cumulativeDebt]);
                const now = new Date(Date.UTC(startDate.substring(0, 4), startDate.substring(5, 7) - 1, startDate.substring(8, 10)));
                const then = new Date(Date.UTC(debtFreeBy.substring(0, 4), debtFreeBy.substring(5, 7) - 1, debtFreeBy.substring(8, 10)));
                let startYear = now.getUTCFullYear();
                let startMonth = now.getMonth();
                let targetDate = then.getUTCDate();
                if (now.getDate() < targetDate) startMonth += 1;
                else if (now.getDate() === targetDate) startMonth += 1;
                if (startMonth === 12) {
                    startYear += 1;
                    startMonth = 0;
                }
                let curDate = 0;

                for (let x = 0; x < monthsToPay; x++) {
                    if (targetDate >= 29 && startMonth === 1 && startYear % 4 === 0) curDate = 29;
                    else if (targetDate >= 28 && startMonth === 1 && startYear % 4 !== 0) curDate = 28;
                    else if (targetDate === 31 && (startMonth === 3 || startMonth === 5 || startMonth === 8 || startMonth === 10)) curDate = 30;
                    else curDate = targetDate;
                    let now = new Date(Date.UTC(startYear, startMonth, curDate));
                    cumulativeDebt = cumulativeDebt - affordablePayment + cumulativeDebt * monthlyInterest;
                    list.push([now.toISOString().split('T')[0], Math.max(cumulativeDebt, 0)]);
                    startMonth++;
                    if (startMonth === 12) {
                        startYear += 1;
                        startMonth = 0;
                    }
                }

                setData(list);
                setOptions({
                    title: 'Debt Repayment',
                    hAxis: { title: 'Date' },
                    vAxis: { title: 'Debt Remaining' },
                    legend: 'none',
                    colors: ['#ab151c'],
                    chartArea: { width: '600px', height: '500px' },
                    areaOpacity: 0.5,
                    backgroundColor: '#F1F1F1',
                    curveType: 'none',
                    animation: {
                        startup: true,
                        duration: 500,
                        easing: 'out',
                    },
                });

                setChartAvailable(true);
                scrollToBottom();
            }
        }
    }, [graphReady, monthsToPay, debt, monthlyInterest, affordablePayment, startDate, debtFreeBy]);

    // All these variables are either input variable or output variable from the calculator
    // that calculates the interest savings from making a lump sum payment today.
    const [debt2, setDebt2] = useState('');                             // The total amount owing
    const [interest2, setInterest2] = useState('');                     // Annual interest rate as a percent
    const [lumpSum, setLumpSum] = useState('');                         // The lump sum payment
    const [term, setTerm] = useState('');                               // Whether the interest is annual or monthly
    const [interestReduction, setInterestReduc] = useState('');     // Field wherein output is displayed

    /**
     * This function calculates the interest savings from making a lump sum payment today using the following formula:
     * (debt * (interest / 100)) - ((debt - lumpSum) * (interest / 100)). The formula first calculates the interest
     * that would be paid on the debt before the lump sum payment and then calculates the interest paid on the debt 
     * after the lump sum payment and displays the difference between the two in the output field.
     */
    function setInterestReduction() {
        var inputs = document.querySelectorAll("#DebtCalc2 input[required]")
        var flag = false;

        // Checks if all fields are filled out properly. If not, the flag is set to true and the input field is
        // highlighted with a red border. If they are valid, then their border is returned to normal.
        for (var x = 0; x < inputs.length; x++) {
            if (!inputs[x].value) {
                inputs[x].style.border = "2px solid red";
                flag = true;
            }

            else {
                inputs[x].style.border = "2px solid white";
            }
        }

        // Check if the interest term is selected. If not, the flag is set to true and the input field is highlighted
        // with a red border.
        if (term === 'undefined' || term === '') {
            document.getElementById("interestTerm").style.border = "2px solid red";
            flag = true;
        }

        // If the input is valid, then the border is returned to normal.
        else {
            document.getElementById("interestTerm").style.border = "2px solid white";
        }

        // If the flag is true, then an alert is displayed to the user to fill out all fields properly before returning
        // false to abort the calculation.
        if (flag) {
            alert("Please fill out all fields for the Interest Reduction Calculator.");
            setInterestReduc("");
            return;
        }

        const debt = parseFloat(debt2);                                 // Total amount owing
        
        // Calculates the interest savings based on whether the interest is annual or monthly and displays
        // the output to the user.
        if (term === 'annual') {
            const oldInterest = debt * (interest2 / 100);
            const newInterest = (debt - lumpSum) * (interest2 / 100);
            const interestDiff = oldInterest - newInterest;
            setInterestReduc("If you were to make a lump sum payment of $" + parseFloat(lumpSum).toFixed(2).toString() +
            " today, you would save a total of $" + interestDiff.toFixed(2) + " a year in interest costs.");
        }

        else {
            const oldInterest = (debt * (interest2 / 100)) / 12;
            const newInterest = ((debt - lumpSum) * (interest2 / 100)) / 12;
            const interestDiff = oldInterest - newInterest;
            setInterestReduc("If you were to make a lump sum payment of $" + parseFloat(lumpSum).toFixed(2).toString() +
            " today, you would save a total of $" + interestDiff.toFixed(2) + " a month in interest costs.");
        }

        scrollToBottom();
    }
    

    // A quick helper function to validate if a number is valid. If it is not, then an alert is displayed
    // to the user and the value is set to an empty string.
    function validateNumber(value) {
        if (isNaN(value)) {
            alert("Please enter a valid number.");
            value = "";
            return false;
        }

        else if (value < 0) {
            alert("Please enter a positive number.");
            value = "";
            return false;
        }

        else if (value === "") {
            return false;
        }

        return true;
    }

    // A quick helper function to validate if an interest rate is valid. If it is not, then an alert is displayed
    // to the user and the value is set to an empty string.
    function validateInterest(value) {
        if (isNaN(value)) {
            alert("Please enter a valid number.");
            value = "";
            return false;
        }

        else if (value < 0 || value > 100) {
            alert("Please enter a valid interest rate between 0 and 100.");
            value = "";
            return false;
        }

        else if (value === "") {
            return false;
        }

        return true;
    }

    // A quick helper function to validate if a date is valid. If it is not, then an alert is displayed
    // to the user.
    function validateDate(date) {
        const then = new Date();
        then.setFullYear(date.substring(0, 4));
        then.setMonth(date.substring(5, 7) - 1);
        then.setDate(date.substring(8, 10));
        then.setHours(12);
        const min = new Date();
        min.setMonth(min.getMonth() + 1);
        min.setDate(min.getDate());
        min.setHours(0);

        if (then < min) {
            alert("Please enter a date at least one month in the future.");
            return false;
        }

        return true;
    }

    /**
     * This function quickly scrolls the user to the bottom of the page to make sure that the input
     * is visible after calculation.
     */
    function scrollToBottom() {
        console.log("Inside scrollToBottom...");
        // The duration of the scroll, the position of where the window currently is, the position of where the window
        // ends and the time at which the scroll started are all initialized.
        const duration = 375;
        const startY = window.scrollY;
        const startTime = performance.now();
      
        // Inner function that actually scrolls the window
        function scroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            // If the time hasn't elapsed, then the window is scrolled by a small increment to
            // make the scroll less jarring.
            if (elapsedTime < duration) {
                window.scrollTo(0, smoothScroll(elapsedTime, startY, document.documentElement.scrollHeight - window.innerHeight - startY, duration));
                requestAnimationFrame(scroll);
            } 
            
            // If the time has elapsed, then the window is scrolled to the end position
            else {
                window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight);
            }
        }

        // Inner function that calculates the easing of the scroll so it isn't abrupt
        function smoothScroll(elapsed, startingY, yDifference, duration) {
            // Moves half the distance over a given unit of time to quickly accelerate
            // downward initially but slow down towards the end
            elapsed /= duration / 2;

            // If the elapsed time is less than 1, then the scroll is still accelerating
            // and the window is scrolled by increasinlgy large increments
            if (elapsed < 1) return yDifference / 2 * elapsed * elapsed + startingY;
            elapsed--;

            // If the elapsed time is greater than 1, then the scroll is decelerating
            // and the window is scrolled by increasingly small increments
            return -yDifference / 2 * (elapsed * (elapsed - 2) - 1) + startingY;
        }
      
        requestAnimationFrame(scroll);
    }

    /**
     * The following code is the HTML code for the debt calculator page. It contains two forms, one for each
     * calculator. Each form contains input fields for the user to enter their information and a button to
     * calculate the output. The output is displayed in a textarea field that is read only.
     */
    return (
        <div id="DebtCalculatorPage">
            <div id="DebtContainer">
                <form id="DebtCalc1">
                    <h1 id="DebtCalcHeading1">Monthly Payment</h1>

                    <label for="debt1">Total Amount Owing</label><br></br>
                    <input type="number" id="debt1" name="debt1" value={debt1} 
                    onChange={(e) => setDebt1(parseFloat(e.target.value))}
                    onBlur={(e) => {if (validateNumber(e.target.value)) setDebt1(parseFloat(e.target.value).toFixed(2))
                                    else setDebt1('')}} 
                    placeholder="Enter total amount owing..." required min="0"></input><br></br>

                    <label for="interest1">Interest Rate (Annual)</label><br></br>
                    <input type="number" id="interest1" name="interest1" value={interest1} 
                    onChange={(e) => setInterest1(parseFloat(e.target.value))} 
                    onBlur={(e) => {if (validateInterest(e.target.value)) setInterest1(parseFloat(e.target.value).toFixed(2))
                                    else setInterest1('')}}
                    placeholder="Enter interest rate (22.9 = 22.9% interest)" required min="0"></input><br></br>

                    <label for="surplusIncome">Surplus Income (Monthly)</label><br></br>
                    <input type="number" id="surplusIncome" name="surplusIncome" value={surplusIncome} 
                    onChange={(e) => setSurplusIncome(parseFloat(e.target.value))} 
                    onBlur={(e) => {if (validateNumber(e.target.value)) setSurplusIncome(parseFloat(e.target.value).toFixed(2))
                                    else setSurplusIncome('')}}
                    placeholder="Enter monthly surplus income..." required min="0"></input><br></br>

                    <label for="date">Desired Debt-Free Date</label><br></br>
                    <input type="date" id="date" name="date" value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    onBlur={(e) => {if (validateDate(e.target.value)) setDate(e.target.value)
                                    else setDate('')}} required></input><br></br>

                    <button type="button" onClick={validateMonthlyPayment}>Calculate</button><br></br>

                    <div id="DebtCalc1Output">
                        <h3 id="monthlyPayment">Required Monthly Payment</h3><br></br>
                        <p id="monthlyPayment">{monthlyPayment}</p>
                    </div>
                </form>

                <form id="DebtCalc2">
                    <h1 id="DebtCalcHeading2">Interest Reduction</h1>

                    <label for="debt2">Total Amount Owing</label><br></br>
                    <input type="number" id="debt2" name="debt2" value={debt2} 
                    onChange={(e) => setDebt2(parseFloat(e.target.value))}
                    onBlur={(e) => {if (validateNumber(e.target.value)) setDebt2(parseFloat(e.target.value).toFixed(2))
                                    else setDebt2('')}} 
                    placeholder="Enter total amount owing..." required min="0"></input>
                    <br></br>

                    <label for="interest2">Interest Rate (Annual)</label><br></br>
                    <input type="number" id="interest2" name="interest2" value={interest2} 
                    onChange={(e) => setInterest2(parseFloat(e.target.value))} 
                    onBlur={(e) => {if (validateInterest(e.target.value)) setInterest2(parseFloat(e.target.value).toFixed(2))
                                    else setInterest1('')}}
                    placeholder="Enter interest rate (22.9 = 22.9% interest)" required min="0"></input>
                    <br></br>

                    <label for="lumpSum">Lump Sum Payment</label><br></br>
                    <input type="number" id="lumpSum" name="lumpSum" value={lumpSum}
                    onChange={(e) => setLumpSum(parseFloat(e.target.value))}
                    onBlur={(e) => {if (validateNumber(e.target.value)) setLumpSum(parseFloat(e.target.value).toFixed(2))
                                    else setLumpSum('')}}
                    placeholder="Enter lump sum payment..." required min="0"></input>
                    <br></br>

                    <label for="interestTerm">Annual or Monthly Interest</label><br></br>
                    <select id="interestTerm" name="interestTerm" value={term} required 
                    onChange={(e) => setTerm(e.target.value)}>
                        <option value="undefined">Select...</option>
                        <option value="annual">Annual</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <br></br>

                    <button type="button" onClick={setInterestReduction}>Calculate</button><br></br>
                    
                    <div id="DebtCalc2Output">
                        <h3 id="interestReduction">Reduction in Interest Cost</h3><br></br>
                        <p id="interestReduction">{interestReduction}</p>
                    </div>

                </form>
            </div>
            <br></br>

            {chartAvailable && ( <div id="DebtChart">
                <Chart
                width="100%"
                height="600px"
                chartType="AreaChart"
                curveType="none"
                loader={<div>Loading Chart</div>}
                data={data}
                options={options}
            /></div>)}
        </div>
    );
}

export default Debt;