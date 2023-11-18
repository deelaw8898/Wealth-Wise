import React, { useState } from "react";
import "./luxury.css";

function Luxury() {
  // State variables to store user inputs and calculated values
  const [itemPrice, setItemPrice] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [selectedTP, setSelectedTP] = useState("");
  const [totalSpending, setTotalSpending] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [affordabilityPlanSavings, setAffordabilityPlanSavings] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [affordabilityPlan, setAffordabilityPlan] = useState("very-comfortable");
  const [monthsToSave, setMonthsToSave] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const calculateTotalSpending = () => {
    // Tax rate constant
    const taxRate = 0.11;

    // Input validation: Check if any input is zero or negative
    if (itemPrice <= 0 || timePeriod <= 0 || monthlyIncome <= 0) {
      setErrorMessage("Please enter values higher than 0 for all inputs.");
      return;
    } else {
      setErrorMessage(""); // Clear error message if inputs are valid
    }

    setSelectedTP(timePeriod);

    if (!isNaN(itemPrice) && !isNaN(timePeriod) && !isNaN(monthlyIncome)) {
      // Calculate total spending including tax
      const taxAmount = itemPrice * taxRate;
      const totalPrice = itemPrice + taxAmount;
      setTotalSpending(totalPrice);

      // Calculate monthly savings required to reach the goal
      const requiredSavings = totalPrice / timePeriod;
      setMonthlySavings(requiredSavings.toFixed(2));

      // Define savings percentage based on affordability plan
      const savingsPercentage =
        affordabilityPlan === "very-comfortable"
          ? 0.3
          : affordabilityPlan === "comfortable"
          ? 0.5
          : 0.9;

      // Calculate allotable funds based on monthly income and savings percentage
      const allotableFunds = monthlyIncome * savingsPercentage;

      if (allotableFunds > 0) {
        // Calculate the number of months required to save
        const months = Math.ceil(totalPrice / allotableFunds);
        
        // Calculate monthly savings with affordability plan
        const APrequiredSavings = totalPrice / months;

        // Update state variables with calculated values
        setAffordabilityPlanSavings(APrequiredSavings.toFixed(2));
        setMonthsToSave(months);
      }
    }
  };

  return (
    <section className="LuxuryContainer">
      <div className="container-fluid">
        <h1 className="mt-5">Luxury Spending Calculator</h1>

        {/* Input for Item Price */}
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Item Price"
            value={itemPrice}
            onChange={(e) => {
              const newValue = Math.max(0, parseFloat(e.target.value));
              setItemPrice(newValue);
            }}
          />
        </div>

        {/* Input for Time Period (in months) */}
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Time Period (in months)"
            value={timePeriod}
            onChange={(e) => {
              const newValue = Math.max(0, parseInt(e.target.value, 10));
              setTimePeriod(newValue);
            }}
          />
        </div>

        {/* Input for Monthly Expendable Income */}
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Monthly Expendable Income"
            value={monthlyIncome}
            onChange={(e) => {
              const newValue = Math.max(0, parseFloat(e.target.value));
              setMonthlyIncome(newValue);
            }}
          />
        </div>

        {/* Dropdown for Affordability Plan */}
        <div className="form-group">
          <label htmlFor="affordabilityPlan">Affordability Plan:</label>
          <select
            className="form-control"
            id="affordabilityPlan"
            value={affordabilityPlan}
            onChange={(e) => setAffordabilityPlan(e.target.value)}
          >
            <option value="very-comfortable">Very Comfortable</option>
            <option value="comfortable">Comfortable</option>
            <option value="asap">As Soon As Possible</option>
          </select>
        </div>

        {/* Display calculated values if total spending is greater than 0 */}
        {totalSpending > 0 && (
          <div>
            <p>
              Total Spending (including tax): ${totalSpending.toFixed(2)}
            </p>
            <p>
              Monthly Savings for {selectedTP}{" "}
              {selectedTP === 1 ? "Month" : "Months"}: ${monthlySavings}
            </p>
            <p>
              Monthly Savings (With Affordability Plan): ${affordabilityPlanSavings}
            </p>
            <p>
              Time Until Purchase (With Affordability Plan):{" "}
              {monthsToSave} {monthsToSave === 1 ? "month" : "months"}
            </p>
          </div>
        )}
      </div>

      {/* Button to trigger the calculation */}
      <button className="btn btn-primary" onClick={calculateTotalSpending}>
        Calculate
      </button>

      {/* Display error message if any */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </section>
  );
}

export default Luxury;


// Manual testing has been conducted
// Results along with documentation can be found in the "Luxury_Spending_Testing" file