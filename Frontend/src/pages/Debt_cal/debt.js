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

    const [firstTestState, setFirstTestState] = useState(true);          // Used for testing purposes
    const [testDone, setTestDone] = useState(false);                      // Used for testing purposes

    // VARIABLES FOR INPUT FIELDS
    const [debt1, setDebt1] = useState('');                     // Total amount owing
    const [interest1, setInterest1] = useState('');             // Annual interest rate as a percent
    const [surplusIncome, setSurplusIncome] = useState('');     // Average monthly surplus income
    const [date, setDate] = useState('');                       // Desired debt-free date

    // VARIABLES FOR OUTPUT FIELD
    const [monthlyPayment, setMonthlyPayment] = useState('');   // Field wherein output is displayed

    // VARIABLES FOR FUNCTION USE
    const [startDate, setStartDate] = useState('');                                 // Start date for the graph
    const [targetDate, setTargetDate] = useState('');                               // Target end date for the graph
    const [debt, setDebt] = useState(0);                                            // Total amount owing
    const [interest, setInterest] = useState(0);                                    // Annual interest rate as a percent
    const [surplus, setSurplus] = useState(0);                                      // Average monthly surplus income
    const [monthlyInterest, setMonthlyInterest] = useState(0);                      // Monthly interest rate as a percent
    const [reqPayment, setReqPayment] = useState(0);                                // Required monthly payment to be debt free by the desired date  
    const [affordablePayment, setAffordablePayment] = useState(0);                  // Affordable payment (if it exists)
    const [monthsToPay, setMonthsToPay] = useState(0);                              // Months to pay off debt
    const [debtFreeBy, setDebtFreeBy] = useState('');                               // Date by which debt will be paid off (desired)
    const [textReady, setTextReady] = useState(false);                              // Whether the text is ready to be displayed
    const [graphReady, setGraphReady] = useState(false);                            // Whether the graph is ready to be displayed
    const [data, setData] = useState([]);                                           // Data for the chart
    const [options, setOptions] = useState([]);                                     // Options for the chart
    const [chartAvailable, setChartAvailable] = useState(false);                    // Whether the chart is available
    const [monPayReady, setMonPayReady] = useState(false);                          // Whether the test is done

    // The following function is used to validate the input fields and calculate the required monthly payment
    // to be debt free by the desired date. It does this by first checking if all the input fields are filled
    // out properly. If not, then an alert is displayed to the user to fill out all fields properly before
    // returning false to abort the calculation. If the inputs are valid, then the values are placed into
    // variables that will be used by the requiredMonthlyPayment function to calculate the required monthly
    // payment to be debt free by the desired date.
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

        // Readies the variables for the requiredMonthlyPayment function to calculate the required monthly payment
        setStartDate(new Date().toISOString().split('T')[0]);
        setTargetDate(date);
        setDebt(parseFloat(debt1));
        setInterest(parseFloat(interest1) / 100);
        setSurplus(parseFloat(surplusIncome));
        setMonPayReady(true);
    }

    /**
     * The current function calculates the required monthly payment using the following formula:
     * (debt * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months)).
     * The formula first multiples the debt value by the monthlyInterestRate and then divides
     * that result by 1 - Math.pow(1 + monthlyInterestRate, -months). The latter part of the
     * formula is the geometric series formula for calculating the sum of a geometric series
     * which in this case can be used to compute the amount of money that would need to be paid
     * each month given a certain percentage of accumulating interest to have the debt paid off
     * by the desired date.
     */
    useEffect(() => {
        if (monPayReady) {
            setMonthsToPay(0);
            setDebtFreeBy('');
            setAffordablePayment(0);
            setReqPayment(0);
            setMonPayReady(false);
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
            
            // Fringe case where user is already debt free or accidentally inputs 0.
            if (debt === 0) {
                setMonthsToPay(0);
                setDebtFreeBy(now.toISOString().split('T')[0]);
                setAffordablePayment(monthlyPaymentCalc);
                setReqPayment(monthlyPaymentCalc);
            }

            // If the required payment is not affordable, finds out how soon the debt can be paid off with the current surplus income.
            // It does this by subtracting the payment from the debt plus whatever interest accrued on a daily basis until the user has
            // paid off their debt. Each time it loops, it increments the days to pay variable which, in the end, describes to the user
            // how often they'll have to pay the prescribed amount every month to be debt free.

            // The formula used here for calculating the months necessary to pay off the debt is derived from the formula for calculating 
            // the sum of a geometric series that was used above to calculate the required monthly payment. The formula is as follows: 
            // months = Math.ceil(Math.abs(Math.log(1 - (debt * monthlyInterestRate) / surplus) / Math.log(1 + monthlyInterestRate))).
            // This is essentially the same formula as above but rearranged to solve for months instead of the required monthly payment by
            // applying logarithmic transformation to both sides to extract the exponent and then dividing the debt by the surplus income
            // to get the ratio of the debt to the surplus income. 
            
            // The Math.ceil function is used to round up to the nearest integer since
            // we want to calculate how many payments are necessary and if at least 11.5 payments are necessary, then 12 payments will be
            // necessary since you can't make half a payment. The Math.abs function is used to ensure that the months to pay is always a
            // positive number since the log of a number between 0 and 1 is always negative and we want to ensure that the months to pay is
            // always positive.
            else if (difference > 0) {
                let monthsToPayOff = Math.ceil(Math.abs(Math.log(1 - (debt * monthlyInterestRate) / surplus) / Math.log(1 + monthlyInterestRate)));
                
                setMonthsToPay(monthsToPayOff);

                // If the months to pay off is a number, then the output field is updated to display the required monthly payment.
                // If not, that means that the debt will not be diminished with the user's current surplus income and so the
                // payment is unaffordable. The formula here is essentially the same as the formula used first for the sum of a
                // geometric series but now with the new value of months to pay off.
                if (!isNaN(monthsToPayOff)) {
                    let newMonthlyPaymentCalc = 0;
                    if (monthlyInterestRate > 0) newMonthlyPaymentCalc = ((debt * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -monthsToPayOff))).toFixed(2);
                    else newMonthlyPaymentCalc = (debt / monthsToPayOff).toFixed(2);
                    let debtFreeBy = new Date(Date.UTC(now.getUTCFullYear() + (monthsToPayOff / 12), (now.getUTCMonth() + (monthsToPayOff % 12)) % 12, 15));

                    // This covers the possibility of shorter months to avoid month overflow. Leap years are also covered
                    // by this logic.
                    if (then.getUTCDate() >= 29 && debtFreeBy.getMonth() === 1 && debtFreeBy.getFullYear() % 4 === 0) debtFreeBy.setDate(29);
                    else if (then.getUTCDate() >= 28 && debtFreeBy.getMonth() === 1 && debtFreeBy.getFullYear() % 4 !== 0) debtFreeBy.setDate(28);
                    else if (then.getUTCDate() === 31 && (debtFreeBy.getMonth() === 3 || debtFreeBy.getMonth() === 5 || debtFreeBy.getMonth() === 8 || debtFreeBy.getMonth() === 10)) debtFreeBy.setDate(30);
                    else debtFreeBy.setUTCDate(then.getUTCDate());

                    setDebtFreeBy(debtFreeBy.toISOString().split('T')[0]);
                    setAffordablePayment(newMonthlyPaymentCalc);
                    setReqPayment(monthlyPaymentCalc);
                }
            }

            // This covers the case where the user can afford to pay off their debt by the desired date with their current
            // surplus income.
            else {
                setMonthsToPay(months);
                setDebtFreeBy(then.toISOString().split('T')[0]);
                setAffordablePayment(monthlyPaymentCalc);
                setReqPayment(monthlyPaymentCalc);
            }

            if (firstTestState) setTestDone(true);

            else setTextReady(true);
        }
    }, [monPayReady, startDate, targetDate, debt, interest, surplus]);

    // This useEffect function updates the output field to display the required monthly payment to be debt free by the
    // desired date. It does this by first checking if the text is ready to be displayed and then checking if the
    // amount of months is a number. If it is, then the output field is updated to display the required monthly
    // payment. If it is not, then the output field is updated to display that the user cannot afford to pay off
    // their debt with their current surplus income.
    useEffect(() => {
        if (textReady && !firstTestState) {
            setTextReady(false);
            if (!isNaN(monthsToPay)) {
                if (monthsToPay === 0) setMonthlyPayment("You're already debt free!");

                else if (debtFreeBy !== targetDate) {
                    setMonthlyPayment("To be debt free by " + targetDate + ", you would need to pay about $" + 
                    reqPayment.toString() + " a month which is more than you can afford by about $" + (reqPayment - affordablePayment).toFixed(2).toString() + ". If you were to pay $" + 
                    affordablePayment.toString() + " a month over " + monthsToPay + " months, you would be debt free by " + debtFreeBy + ".");
                    setGraphReady(true);
                }

                else {
                    setMonthlyPayment("To be debt free by " + debtFreeBy + ", you would need to pay about $" + 
                    affordablePayment.toString() + " a month in " + monthsToPay.toString() + " monthly installments.");
                    setGraphReady(true);
                }
            }

            else setMonthlyPayment("You cannot afford to pay off your debt with your current surplus income.");
        }
    }, [textReady, reqPayment, affordablePayment, monthsToPay, debtFreeBy, targetDate, firstTestState]);


    // The following useEffect function populates the graph and calculates the points at which payment will be made
    // whenever all of its variables are ready. It does this by first calculating the cumulative debt at each point
    // in time and then adding that point to the list of points to be displayed on the graph at the corresponding
    // time on the y axis. Once all the points are calculated, the data and options for the graph are set and the
    // graph is displayed to the user.
    useEffect(() => {
        if (graphReady && !firstTestState) {
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
                console.log(now.getUTCDate());
                console.log(targetDate);
                if (now.getUTCDate() >= targetDate) startMonth += 1;
                console.log(startMonth);
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
    }, [graphReady, monthsToPay, debt, monthlyInterest, affordablePayment, startDate, debtFreeBy, firstTestState]);


    // TEST CASES - The following test cases operate on every input field and test the functionality of the calculator.
    // Each test case is designed to test a specific aspect of the calculator and is designed to fail if the calculator
    // is not working as expected and covers all of the fringe cases and the cases inbetweeen to test the function's 
    // operation in real world cases where input is messy and highly variable.
    const testStart = ["2023-01-01", "2024-01-31", "2024-01-01", "2024-01-01", "2024-01-01", "2024-01-15", "2024-01-15"];
    const testTarget = ["2024-01-01", "2024-02-29", "2024-12-01", "2025-01-01", "2024-11-01", "2025-01-15", "2024-03-15"];
    const testDebt = [1000, 1000, 1000, 1000, 1000, 10000, 0];
    const testInterest = [0.229, 0.229, 0.229, 0.229, 0, 0.229, 0];
    const testSurplus = [100, 1100, 94.03, 10, 100, 200, 0];

    const expDates = ["2024-01-01", "2024-02-29", "2025-01-01", '', '2024-11-01', "2037-09-15", "2024-01-15"];
    const expPays = [94.03, 1019.08, 101.65, 0, 100, 940.28, 0];
    const expAffords = [94.03, 1019.08, 94.03, 0, 100, 199.83, 0];
    const expMonths = [12, 1, 12, NaN, 10, 164, 0];

    const [expDate, setExpDate] = useState('');
    const [expPay, setExpPay] = useState(0);
    const [expAfford, setExpAfford] = useState(0);
    const [expMonth, setExpMonth] = useState(0);
    const [last, setLast] = useState(false);
    const [testNum, setTestNum] = useState(0);

    // The below two useEffect functions are used for testing purposes. The first one is used to set the input fields
    // which triggers the requiredMonthlyPayment function to calculate the required monthly payment. The second one
    // verifies the output of the calculator and determines whether the test passed or failed. If the test passed,
    // then the test number is incremented and the next test is run. If the test failed, then the test number is
    // incremented and the next test is run with a message sent to the console to indicate passing or failing.
    useEffect(() => {
        if (firstTestState) {
            setTestNum(testNum);
            setStartDate(testStart[testNum]);
            setTargetDate(testTarget[testNum]);
            setDebt(testDebt[testNum]);
            setInterest(testInterest[testNum]);
            setSurplus(testSurplus[testNum]);

            setExpDate(expDates[testNum]);
            setExpPay(expPays[testNum]);
            setExpAfford(expAffords[testNum]);
            setExpMonth(expMonths[testNum]);
            
            setMonPayReady(true);
            if (testNum === testStart.length - 1) setLast(true);
        }
    }, [firstTestState, testNum]);

    useEffect(() => {
        if (firstTestState && testDone) {
            setTestDone(false);
            let diff1 = Math.abs(affordablePayment - expAfford);
            let diff2 = Math.abs(reqPayment - expPay);

            // console.log(affordablePayment);
            // console.log(debtFreeBy);
            // console.log(expDate);
            // console.log(monthsToPay);
            // console.log(expMonth);
            // console.log(diff1);
            // console.log(diff2);
    
            if (debtFreeBy === expDate && diff1 === 0 && diff2 === 0 && monthsToPay === expMonth) {
                console.log("Monthly Payment Calculator Test " + testNum.toString() + " Passed!")
            }

            else if (debtFreeBy === expDate && diff1 === 0 && diff2 === 0) {
                if (isNaN(monthsToPay) && isNaN(expMonth)) {
                    console.log("Monthly Payment Calculator Test " + testNum.toString() + " Passed!")
                }
            }

            else {
                console.log("Monthly Payment Calculator Test " + testNum.toString() + " Failed!");
            }

            setTestNum(testNum + 1);
            if (last) setFirstTestState(false);
        }
    }, [firstTestState, testDone, debtFreeBy, expDate, reqPayment, expPay, affordablePayment, expAfford, monthsToPay, expMonth, last]);

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