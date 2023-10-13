import React, {useState} from "react";
import './debt.css';

function Debt() {
    const [debt1, setDebt1] = useState('');
    const [date, setDate] = useState('');
    const [surplusIncome, setSurplusIncome] = useState('');
    const [interest1, setInterest1] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState('');

    function calculate1() {
        var inputs = document.querySelectorAll("#DebtCalc1 input[required]")
        var flag = false;

        for (var x = 0; x < inputs.length; x++) {
            if (!inputs[x].value) {
                inputs[x].style.border = "2px solid red";
                flag = true;
            }

            else {
                inputs[x].style.border = "2px solid white";
            }
        }

        if (flag) {
            alert("Please fill out all fields for the Monthly Payment Calculator.");
            setMonthlyPayment("");
            return false;
        }

        const now = new Date();
        const then = new Date(date);
        const days = Math.ceil((then - now) / (1000 * 60 * 60 * 24));

        const debt = parseFloat(debt1);
        const dailyInterest = (parseFloat(interest1) / 100) / 365.25;
        const monthlyPaymentCalc = ((365.25 / 12) * (debt / ((1 - (1 + dailyInterest) ** -(days)) / dailyInterest))).toFixed(2);

        const difference = (monthlyPaymentCalc - surplusIncome).toFixed(2);
        const daysToPay = Math.ceil((-(Math.log(1 - (dailyInterest / debt * parseFloat(surplusIncome))) / Math.log(1 + dailyInterest))) * (365.25 / 12));
        const newDebtFreeDate = new Date(now.getTime() + (daysToPay * 24 * 60 * 60 * 1000));

        if (difference > 0) {
            setMonthlyPayment("To be debt free by this date, you would need to pay about $" + monthlyPaymentCalc.toString() + " a month. " +
            "It looks like this is about $" + difference.toString() + " more than you can afford per month " +
            "given your surplus income. If you were to pay $" + surplusIncome.toString() + " a month, you would be debt free by " 
            + newDebtFreeDate.toDateString() + ".");
        }

        else {setMonthlyPayment("To be debt free by this date, you would need to pay about $" + monthlyPaymentCalc.toString() + " a month.");}
    }

    const [debt2, setDebt2] = useState('');
    const [interest2, setInterest2] = useState('');
    const [lumpSum, setLumpSum] = useState('');
    const [term, setTerm] = useState('');
    const [interestReduction, setInterestReduction] = useState('');

    function calculate2() {
        var inputs = document.querySelectorAll("#DebtCalc2 input[required]")
        var flag = false;

        for (var x = 0; x < inputs.length; x++) {
            if (!inputs[x].value) {
                inputs[x].style.border = "2px solid red";
                flag = true;
            }

            else {
                inputs[x].style.border = "2px solid white";
            }
        }

        if (term === 'undefined' || term === '') {
            document.getElementById("interestTerm").style.border = "2px solid red";
            flag = true;
        }

        else {
            document.getElementById("interestTerm").style.border = "2px solid white";
        }

        if (flag) {
            alert("Please fill out all fields for the Interest Reduction Calculator.");
            setInterestReduction("");
            return;
        }

        const debt = parseFloat(debt2);
        
        if (term === 'annual') {
            const oldInterest = debt * (interest2 / 100);
            const newInterest = (debt - lumpSum) * (interest2 / 100);
            const interestDiff = oldInterest - newInterest;
            setInterestReduction("If you were to make a lump sum payment of $" + parseFloat(lumpSum).toFixed(2).toString() +
            " today, you would save a total of $" + interestDiff.toFixed(2) + " a year in interest costs.");
        }

        else {
            const oldInterest = (debt * (interest2 / 100)) / 12;
            const newInterest = ((debt - lumpSum) * (interest2 / 100)) / 12;
            const interestDiff = oldInterest - newInterest;
            setInterestReduction("If you were to make a lump sum payment of $" + parseFloat(lumpSum).toFixed(2).toString() +
            " today, you would save a total of $" + interestDiff.toFixed(2) + " a month in interest costs.");
        }
    }
    

    function validateNumber(value) {
        if (isNaN(value)) {
            alert("Please enter a valid number.");
            return false;
        }

        else if (value < 0) {
            alert("Please enter a positive number.");
            return false;
        }

        else if (value === "") {
            return false;
        }

        return true;
    }

    function validateInterest(value) {
        if (isNaN(value)) {
            alert("Please enter a valid number.");
            return false;
        }

        else if (value < 0 || value > 100) {
            alert("Please enter a valid interest rate between 0 and 100.");
            return false;
        }

        else if (value === "") {
            return false;
        }

        return true;
    }

    function validateDate(date) {
        const now = new Date();
        const then = new Date(date);

        if (then < now) {
            alert("Please enter a date in the future.");
            return false;
        }

        return true;
    }

    // TODO - Do individual validations for every single form so that you can outline in red text some new 
    // text to indicate that the field needs to be filled out properly.

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
                    onBlur={(e) => {if (validateDate(e.target.value)) setDate(e.target.value)}} required></input><br></br>

                    <button type="button" onClick={calculate1}>Calculate</button><br></br>

                    <label for="monthlyPayment">Required Monthly Payment</label><br></br>
                    <textarea id="monthlyPayment" name="monthlyPayment" rows="5" cols="50" value={monthlyPayment} readOnly placeholder="The required monthly payment to be debt free by your desired date."></textarea><br></br>
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

                    <button type="button" onClick={calculate2}>Calculate</button><br></br>

                    <label for="interestReduction" id="interestReductionLabel">Reduction in Interest Cost</label><br></br>
                    <textarea id="interestReduction" name="interestReduction" rows="5" cols="50" value={interestReduction} readOnly 
                    placeholder="The amount of interest you will save every month or year if you were to make the given lump sum payment today."></textarea><br></br>

                </form>
            </div>
        </div>
    );
}

export default Debt;