import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import './debt.css';

/**
 * This is the page wherein the debt calculator functions are stored. There are two separate
 * calculators with separate fields and separate calculations. The first calculator is for
 * calculating the monthly payment required to be debt free by a certain date, while the second
 * calculator is for calculating the interest savings from making a lump sum payment today.
 * 
 * All test cases will operate on page load and then will not run again unless page loaded. This
 * will likely be changed further into development. All test cases were developed by Preston Peters.
 */
function Debt() {
    // The following variables are used for testing purposes. The masterTestFlag is used to determine
    // how many tests have failed. If the masterTestFlag is greater than 0, then at least one test
    // has failed and the user will be notified of this. The allTestDone variable is used to determine
    // whether all the tests have been run. If they have, then the user will be notified of this.
    // The firstTestState and funTestState variables are used to determine whether the first and second
    // calculators have been tested respectively.
    const [masterTestFlag, setMasterTestFlag] = useState(0);                // Used for testing purposes
    const [allTestDone, setAllTestDone] = useState(false);                  // Used for testing purposes
    const [firstTestState, setFirstTestState] = useState(true);             // Used for testing purposes
    const [funTestState, setFunTestState] = useState(true);                 // Used for testing purposes
    
    // FIRST CALCULATOR BELOW HERE - Monthly Payment Calculator

    // All these variables are either input variable or output variable from the calculator
    // that calculates the required monthly payment to be debt free by a certain date.

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
    }, [monPayReady, startDate, targetDate, debt, interest, surplus, firstTestState]);

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
                    cumulativeDebt = parseFloat((cumulativeDebt - affordablePayment + cumulativeDebt * monthlyInterest).toFixed(2));
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
            let testStart = ["2023-01-01", "2024-01-31", "2024-01-01", "2024-01-01", "2024-01-01", "2024-01-15", "2024-01-15"];
            let testTarget = ["2024-01-01", "2024-02-29", "2024-12-01", "2025-01-01", "2024-11-01", "2025-01-15", "2024-03-15"];
            let testDebt = [1000, 1000, 1000, 1000, 1000, 10000, 0];
            let testInterest = [0.229, 0.229, 0.229, 0.229, 0, 0.229, 0];
            let testSurplus = [100, 1100, 94.03, 10, 100, 200, 0];
            let expDates = ["2024-01-01", "2024-02-29", "2025-01-01", '', '2024-11-01', "2037-09-15", "2024-01-15"];
            let expPays = [94.03, 1019.08, 101.65, 0, 100, 940.28, 0];
            let expAffords = [94.03, 1019.08, 94.03, 0, 100, 199.83, 0];
            let expMonths = [12, 1, 12, NaN, 10, 164, 0];

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
    
            if (debtFreeBy === expDate && diff1 === 0 && diff2 === 0 && monthsToPay === expMonth) {
                console.log("Monthly Payment Calculator Test " + testNum.toString() + " Passed!")
            }

            else if (debtFreeBy === expDate && diff1 === 0 && diff2 === 0) {
                if (isNaN(monthsToPay) && isNaN(expMonth)) {
                    console.log("Monthly Payment Calculator Test " + testNum.toString() + " Passed!")
                }

                else {
                    console.log("Monthly Payment Calculator Test " + testNum.toString() + " Failed!");
                    setMasterTestFlag(masterTestFlag + 1);

                    // UNCOMMENT TO DEBUG
                    // console.log("Associated data:");
                    // console.log("Start Date: " + testStart[testNum]);
                    // console.log("Target Date: " + testTarget[testNum]);
                    // console.log("Debt: " + testDebt[testNum]);
                    // console.log("Interest: " + testInterest[testNum]);
                    // console.log("Surplus Income: " + testSurplus[testNum]);
                    // console.log("Expected Date: " + expDates[testNum] + " Actual Date: " + debtFreeBy);
                    // console.log("Expected Payment: " + expPays[testNum] + " Actual Payment: " + reqPayment);
                    // console.log("Expected Affordable Payment: " + expAffords[testNum] + " Actual Affordable Payment: " + affordablePayment);
                    // console.log("Expected Months to Pay: " + expMonths[testNum] + " Actual Months to Pay: " + monthsToPay);
                }
            }

            else {
                console.log("Monthly Payment Calculator Test " + testNum.toString() + " Failed!");
                setMasterTestFlag(masterTestFlag + 1);

                // UNCOMMENT TO DEBUG
                // console.log("Associated data:");
                // console.log("Start Date: " + testStart[testNum]);
                // console.log("Target Date: " + testTarget[testNum]);
                // console.log("Debt: " + testDebt[testNum]);
                // console.log("Interest: " + testInterest[testNum]);
                // console.log("Surplus Income: " + testSurplus[testNum]);
                // console.log("Expected Date: " + expDates[testNum] + " Actual Date: " + debtFreeBy);
                // console.log("Expected Payment: " + expPays[testNum] + " Actual Payment: " + reqPayment);
                // console.log("Expected Affordable Payment: " + expAffords[testNum] + " Actual Affordable Payment: " + affordablePayment);
                // console.log("Expected Months to Pay: " + expMonths[testNum] + " Actual Months to Pay: " + monthsToPay);
            }

            setTestNum(testNum + 1);
            if (last) {
                setFirstTestState(false);
                if (!funTestState) setAllTestDone(true);
            }
        }
    }, [firstTestState, testDone, debtFreeBy, expDate, reqPayment, expPay, affordablePayment, expAfford, monthsToPay, expMonth, last, funTestState, masterTestFlag, testNum]);

    // END OF FIRST CALCULATOR

    // SECOND CALCULATOR BELOW HERE - Interest Reduction Calculator

    // INPUT VARIABLES
    const [debt2, setDebt2] = useState('');                             // The total amount owing
    const [interest2, setInterest2] = useState('');                     // Annual interest rate as a percent
    const [lumpSum, setLumpSum] = useState('');                         // The lump sum payment
    const [term, setTerm] = useState('');                               // Whether the interest is annual or monthly

    // OUTPUT VARIABLES
    const [interestReduction, setInterestReduc] = useState('');         // Field wherein output is displayed

    // FUNCTION VARIABLES
    const [funDebt2, setFunDebt2] = useState(0);                        // The total amount owing
    const [funInterest2, setFunInterest2] = useState(0);                // Annual interest rate as a percent
    const [funLumpSum, setFunLumpSum] = useState(0);                    // The lump sum payment
    const [funTerm, setFunTerm] = useState('');                         // Whether the interest is annual or monthly
    const [funReady, setFunReady] = useState(false);                    // Whether the function is ready to be run
    const [funDisplayReady, setFunDisplayReady] = useState(false);      // Whether the display function is ready to be run
    const [interestDiff, setInterestDiff] = useState('');               // The difference between the interest paid before and after the lump sum payment
    const [funTestDone, setFunTestDone] = useState(false);              // Used for testing purposes
    const [funTestNum, setFunTestNum] = useState(0);                    // Used for testing purposes

    /**
     * This function is used to validate the input fields and calculate the interest savings from making a lump sum
     * payment today. It does this by first checking if all the input fields are filled out properly. If not, then an
     * alert is displayed to the user to fill out all fields properly before returning false to abort the calculation.
     * If the inputs are valid, then the values are placed into variables that will be used by the validateInterestReduction
     * function.
     */
    function validateInterestReduction() {
        setFunDebt2(0);
        setFunInterest2(0);
        setFunLumpSum(0);
        setFunTerm('');
        setInterestReduc('');
        setFunDisplayReady(false);
        setInterestDiff('');
        var inputs = document.querySelectorAll("#DebtCalc2 input[required]")
        var flag = false;

        // Checks if all fields are filled out properly. If not, the flag is set to true and the input field is
        // highlighted with a red border. If they are valid, then their border is returned to normal.
        for (var x = 0; x < inputs.length; x++) {
            if (!inputs[x].value) {
                inputs[x].style.border = "2px solid red";
                flag = true;
            }

            else inputs[x].style.border = "2px solid white";
        }

        // Check if the interest term is selected. If not, the flag is set to true and the input field is highlighted
        // with a red border.
        if (term === 'undefined' || term === '') {
            document.getElementById("interestTerm").style.border = "2px solid red";
            flag = true;
        }

        // If the flag is true, then an alert is displayed to the user to fill out all fields properly before returning
        // false to abort the calculation.
        if (flag) {
            alert("Please fill out all fields for the Interest Reduction Calculator.");
            setInterestReduc("");
            return;
        }

        if (parseFloat(lumpSum) > parseFloat(debt2)) {
            alert("Please enter a lump sum payment that is less than or equal to the total amount owing.");
            setLumpSum("");
            document.getElementById("lumpSum").style.border = "2px solid red";
            setInterestReduc("");
            return;
        }

        setFunDebt2(parseFloat(debt2));
        setFunInterest2(parseFloat(interest2) / 100);
        setFunLumpSum(parseFloat(lumpSum));
        setFunTerm(term);
        setFunReady(true);
    }

    //  This function calculates the interest savings from making a lump sum payment today using the following formula:
    //  (debt * interestRate) - ((debt - lumpSum) * interestRate). The formula first calculates the interest paid on the
    //  debt before the lump sum payment and then calculates the interest paid on the debt after the lump sum payment.
    //  The difference between the two is the interest savings from making the lump sum payment today.
    useEffect(() => {
        if (funReady) {
            setFunReady(false);
            // Calculates the interest savings based on whether the interest is annual or monthly and displays
            // the output to the user.
            if (funTerm === 'annual') {
                const oldInterest = funDebt2 * funInterest2;
                const newInterest = (funDebt2 - funLumpSum) * funInterest2;
                setInterestDiff((oldInterest - newInterest).toFixed(2));
            }

            else {
                const oldInterest = (funDebt2 * funInterest2) / 12;
                const newInterest = ((funDebt2 - funLumpSum) * funInterest2) / 12;
                setInterestDiff((oldInterest - newInterest).toFixed(2));
            }

            if (!funTestState) setFunDisplayReady(true);
            else setFunTestDone(true);
        }
    }, [funReady, funDebt2, funInterest2, funLumpSum, funTerm, funTestState]);

    // This useEffect function updates the output field to display the interest savings from making a lump sum payment
    // today. It does this by first checking if the function is ready to be run and then checking if the term is annual
    // or monthly. If the term is annual, then the output field is updated to display the interest savings in a year.
    // Otherwise, the output field is updated to display the interest savings in a month.
    useEffect(() => {
        if (funDisplayReady) {
            setFunDisplayReady(false);

            if (funTerm === 'annual') {
                setInterestReduc("If you were to make a lump sum payment of $" + funLumpSum.toString() +
                " today, you would save approximately $" + interestDiff + " a year in interest costs.");
            }

            else {
                setInterestReduc("If you were to make a lump sum payment of $" + funLumpSum.toString() +
                " today, you would save approximately $" + interestDiff + " a month in interest costs.");
            }

            scrollToBottom("DebtCalc2Output");
        }
    }, [funDisplayReady, funTerm, interestDiff, funLumpSum]);
    
    // TEST CASES - The following test cases operate on every input field and test the functionality of the calculator.
    // Each test case is designed to test a specific aspect of the calculator and is designed to fail if the calculator
    // is not working as expected and covers all of the fringe cases and the cases inbetweeen to test the function's
    // operation in real world cases where input is messy and highly variable. 
    
    // Since this function is relatively simple, only a few tests will be performed.

    // The following useEffect function is used for testing purposes. It sets the input fields to the test cases
    // and triggers the validateInterestReduction function to calculate the interest savings for verification.
    useEffect(() => {
        if (funTestState) {
            let testDebt2 = [0, 1000, 1000, 1000, 1000, 1000];
            let testInterest2 = [0, 0.229, 0.229, 1.000, 1.000, 1.000];
            let testLumpSum = [0, 0, 1000, 1000, 500, 500];
            let testTerm = ['annual', 'monthly', 'annual', 'annual', 'monthly', 'annual'];
            setFunReady(false);
            setFunTestDone(false);
            setFunDebt2(testDebt2[funTestNum]);
            setFunInterest2(testInterest2[funTestNum]);
            setFunLumpSum(testLumpSum[funTestNum]);
            setFunTerm(testTerm[funTestNum]);
            setFunReady(true);
        }
    }, [funTestState, funTestNum]);

    // The following useEffect function is used for testing purposes. It verifies the output of the calculator
    // and determines whether the test passed or failed. Regardless of the test passing or failing, the test
    // number is incremented and the next test is run. If the test passed or failed, console output is displayed
    // to the user.
    useEffect(() => {
        if (funTestState && funTestDone) {
            let testDebt2 = [0, 1000, 1000, 1000, 1000, 1000];
            let testInterest2 = [0, 0.229, 0.229, 1.000, 1.000, 1.000];
            let testLumpSum = [0, 0, 1000, 1000, 500, 500];
            let testTerm = ['annual', 'monthly', 'annual', 'annual', 'monthly', 'annual'];
            let expInterestDiff = [0, 0, 229, 1000, 41.67, 500];
            setFunTestDone(false);

            let diff = Math.abs(parseFloat(interestDiff) - expInterestDiff[funTestNum]);
            if (diff === 0) console.log("Interest Reduction Calculator Test " + funTestNum.toString() + " Passed!");
            else {
                console.log("Interest Reduction Calculator Test " + funTestNum.toString() + " Failed!");
                console.log("Associated data:");
                console.log("Debt: " + testDebt2[funTestNum]);
                console.log("Interest: " + testInterest2[funTestNum]);
                console.log("Lump Sum: " + testLumpSum[funTestNum]);
                console.log("Term: " + testTerm[funTestNum]);
                console.log("Expected Interest Savings: " + expInterestDiff[funTestNum]);
                console.log("Actual Interest Savings: " + interestDiff);
                setMasterTestFlag(masterTestFlag + 1);
            }

            if (funTestNum === testDebt2.length - 1) {
                setFunTestState(false);
                if (!firstTestState) setAllTestDone(true);
            }

            else setFunTestNum(funTestNum + 1);
        }
    }, [funTestState, funTestDone, interestDiff, funTestNum, firstTestState, masterTestFlag]);

    // END OF SECOND CALCULATOR

    // UNIT CASES FOR HELPER FUNCTIONS BELOW HERE

    // TESTS FOR validateNumber
    // Test 1: Test a valid number
    // Test 2: Test a number that is too low
    // Test 3: Test a number that is not a number
    // Test 4: Test a number that is empty
    const [testNumber, setTestNumber] = useState(0);
    const [numberTested, setNumberTested] = useState(false);
    useEffect(() => {
        if (testNumber < 4) {
            let testNumbers = [100, -1, "test", ""];
            if (testNumber === 0 && validateNumber(testNumbers[testNumber])) console.log("Number Validation Test " + testNumber + " Passed!");
            else if (testNumber !== 0 && !validateNumber(testNumbers[testNumber])) console.log("Number Validation Test " + testNumber + " Passed!");
            else {
                console.log("Number Validation Test " + testNumber + " Failed!");
                setMasterTestFlag(m => m + 1);
            }
            if (testNumber !== testNumbers.length - 1) setTestNumber(t => t + 1);
            else setNumberTested(t => true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testNumber]);

    /* 
     * A quick helper function to validate if a number is valid. If it is not, then an alert is displayed
     * to the user and the value is set to an empty string.
     */
    function validateNumber(value) {
        if (isNaN(value)) {
            if (numberTested) alert("Please enter a valid number.");
            value = "";
            return false;
        }

        else if (value < 0) {
            if (numberTested) alert("Please enter a positive number.");
            value = "";
            return false;
        }

        else if (value === "") {
            return false;
        }

        return true;
    }

    // TESTS FOR validateInterest

    // Test 1: Test a valid interest rate
    // Test 2: Test an interest rate that is too high
    // Test 3: Test an interest rate that is too low
    // Test 4: Test an interest rate that is not a number
    const [interestNum, setInterestNum] = useState(0);
    const [interestTested, setInterestTested] = useState(false);
    useEffect(() => {
        if (interestNum < 4) {
            let testInterest = [22.9, 101, -1, "test"];
            if (interestNum === 0 && validateInterest(testInterest[interestNum])) console.log("Interest Validation Test " + interestNum + " Passed!");
            else if (interestNum !== 0 && !validateInterest(testInterest[interestNum])) console.log("Interest Validation Test " + interestNum + " Passed!");
            else {
                console.log("Interest Validation Test " + interestNum + " Failed!");
                setMasterTestFlag(m => m + 1);
            }
            if (interestNum !== testInterest.length) setInterestNum(interestNum + 1);
            else setInterestTested(t => true);
        }
        // Fix for the useEffect hook running twice on the first render - function is irrelevant to render during tests
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interestNum]);

    /**
      * A quick helper function to validate if an interest rate is valid. If it is not, then an alert is displayed.
      * to the user and the value is set to an empty string.
      */
    function validateInterest(value) {
        if (isNaN(value)) {
            if (interestTested) alert("Please enter a valid number.");
            value = "";
            return false;
        }

        else if (value < 0 || value > 100) {
            if (interestTested) alert("Please enter a valid interest rate between 0 and 100.");
            value = "";
            return false;
        }

        else if (value === "") {
            return false;
        }

        return true;
    }

    // TESTS FOR validateDate

    // Test 1: Test a valid date
    // Test 2: Test a date that is too soon
    const [dateNum, setDateNum] = useState(0);
    const [dateTested, setDateTested] = useState(false);
    useEffect(() => {
        if (dateNum < 2) {
            if (dateNum === 0) {
                let dummyDate = new Date();
                dummyDate.setFullYear(dummyDate.getFullYear() + 1);
                if (validateDate(dummyDate.toISOString().split('T')[0])) console.log("Date Validation Test 1 Passed!");
                else {
                    console.log("Date Validation Test 1 Failed!");
                    setMasterTestFlag(m => m + 1);
                }
            }
            else {
                let dummyDate2 = new Date();
                dummyDate2.setFullYear(dummyDate2.getFullYear() - 1);
                if (!validateDate(dummyDate2.toISOString().split('T')[0])) console.log("Date Validation Test 2 Passed!");
                else {
                    console.log("Date Validation Test 2 Failed!");
                    setMasterTestFlag(m => m + 1);
                }
            }

            if (dateNum !== 1) setDateNum(t => t + 1);
            else setDateTested(t => true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateNum]);

    /**
     * This function is used to validate the date input field. It does this by first checking if the date is valid
     * and then checking if the date is at least one month in the future. If the date is not valid, then an alert
     * is displayed to the user to enter a valid date. A valid date is considered to be at least one month in the
     * future in this context.
     */
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
            if (dateTested) alert("Please enter a date at least one month in the future.");
            return false;
        }

        return true;
    }

    /**
     * This function quickly scrolls the user to the bottom of the page to make sure that the input
     * is visible after calculation.
     */
    function scrollToBottom(id = "") {
        // The duration of the scroll, the position of where the window currently is, the position of where the window
        // ends and the time at which the scroll started are all initialized.
        const duration = 500;
        const currentScrollY = window.scrollY;
        const startY = currentScrollY > 0 ? currentScrollY : 0;
        const startTime = performance.now();
      
        // Inner function that actually scrolls the window
        function scroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            const targetElement = id ? document.getElementById(id) : null;

            const scrollTarget = targetElement
                ? (targetElement.offsetTop + targetElement.scrollHeight - window.innerHeight + 25)
                : (document.documentElement.scrollHeight - window.innerHeight - 60);

            // If the time hasn't elapsed, then the window is scrolled by a small increment to
            // make the scroll less jarring.
            if (elapsedTime < duration) {
                window.scrollTo(0, smoothScroll(elapsedTime, startY, scrollTarget - startY, duration));
                requestAnimationFrame(scroll);
            } 
            
            // If the time has elapsed, then the window is scrolled to the end position
            else {
                window.scrollTo(0, scrollTarget);
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

    // This useEffect function is used to reset the state of the page once all tests are done.
    // If any tests failed (of the automated tests), then the user is notified of how many tests
    // failed and is prompted to check the console for details. If all tests passed, then the user
    // is notified that all tests passed.
    useEffect(() => {
        if (allTestDone) {
            setFirstTestState(false);
            setFunTestState(false);
            setAllTestDone(false);

            if (masterTestFlag === 0) console.log("All tests passed!");
            else console.log(masterTestFlag.toString() + " tests failed. Please check console for details.");
        }
    }, [allTestDone, masterTestFlag]);

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

                    <label htmlFor="debt1">Total Amount Owing</label><br></br>
                    <input type="number" id="debt1" name="debt1" value={debt1} 
                    onChange={(e) => setDebt1(parseFloat(e.target.value))}
                    onBlur={(e) => {if (validateNumber(e.target.value)) setDebt1(parseFloat(e.target.value).toFixed(2))
                                    else setDebt1('')}} 
                    placeholder="Enter total amount owing..." required min="0"></input><br></br>

                    <label htmlFor="interest1">Interest Rate (Annual)</label><br></br>
                    <input type="number" id="interest1" name="interest1" value={interest1} 
                    onChange={(e) => setInterest1(parseFloat(e.target.value))} 
                    onBlur={(e) => {if (validateInterest(e.target.value)) setInterest1(parseFloat(e.target.value).toFixed(2))
                                    else setInterest1('')}}
                    placeholder="Enter interest rate (22.9 = 22.9% interest)" required min="0"></input><br></br>

                    <label htmlFor="surplusIncome">Surplus Income (Monthly)</label><br></br>
                    <input type="number" id="surplusIncome" name="surplusIncome" value={surplusIncome} 
                    onChange={(e) => setSurplusIncome(parseFloat(e.target.value))} 
                    onBlur={(e) => {if (validateNumber(e.target.value)) setSurplusIncome(parseFloat(e.target.value).toFixed(2))
                                    else setSurplusIncome('')}}
                    placeholder="Enter monthly surplus income..." required min="0"></input><br></br>

                    <label htmlFor="date">Desired Debt-Free Date</label><br></br>
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

                    <label htmlFor="debt2">Total Amount Owing</label><br></br>
                    <input type="number" id="debt2" name="debt2" value={debt2} 
                    onChange={(e) => setDebt2(parseFloat(e.target.value))}
                    onBlur={(e) => {if (validateNumber(e.target.value)) setDebt2(parseFloat(e.target.value).toFixed(2))
                                    else setDebt2('')}} 
                    placeholder="Enter total amount owing..." required min="0"></input>
                    <br></br>

                    <label htmlFor="interest2">Interest Rate (Annual)</label><br></br>
                    <input type="number" id="interest2" name="interest2" value={interest2} 
                    onChange={(e) => setInterest2(parseFloat(e.target.value))} 
                    onBlur={(e) => {if (validateInterest(e.target.value)) setInterest2(parseFloat(e.target.value).toFixed(2))
                                    else setInterest1('')}}
                    placeholder="Enter interest rate (22.9 = 22.9% interest)" required min="0"></input>
                    <br></br>

                    <label htmlFor="lumpSum">Lump Sum Payment</label><br></br>
                    <input type="number" id="lumpSum" name="lumpSum" value={lumpSum}
                    onChange={(e) => setLumpSum(parseFloat(e.target.value))}
                    onBlur={(e) => {if (validateNumber(e.target.value)) setLumpSum(parseFloat(e.target.value).toFixed(2))
                                    else setLumpSum('')}}
                    placeholder="Enter lump sum payment..." required min="0"></input>
                    <br></br>

                    <label htmlFor="interestTerm">Annual or Monthly Interest</label><br></br>
                    <select id="interestTerm" name="interestTerm" value={term} required 
                    onChange={(e) => setTerm(e.target.value)}>
                        <option value="undefined">Select...</option>
                        <option value="annual">Annual</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <br></br>

                    <button type="button" onClick={validateInterestReduction}>Calculate</button><br></br>
                    
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