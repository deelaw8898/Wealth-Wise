import React, { useState } from "react";

function Luxury() {
  const [itemPrice, setItemPrice] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [selectedTP, setSelectedTP] = useState("");
  const [totalSpending, setTotalSpending] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [affordabilityPlanSavings, setAffordabilityPlanSavings] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [affordabilityPlan, setAffordabilityPlan] = useState("very-comfortable");
  const [monthsToSave, setMonthsToSave] = useState(0);

  const calculateTotalSpending = () => {
    const taxRate = 0.11;
    const itemPriceNumber = parseFloat(itemPrice);
    const timePeriodNumber = parseInt(timePeriod, 10);
    const monthlyIncomeNumber = parseFloat(monthlyIncome);
    
    setSelectedTP(timePeriod);

    if (
      !isNaN(itemPriceNumber) &&
      !isNaN(timePeriodNumber) &&
      !isNaN(monthlyIncomeNumber)
    ) {
      const taxAmount = itemPriceNumber * taxRate;
      const totalPrice = itemPriceNumber + taxAmount;
      setTotalSpending(totalPrice);

      const requiredSavings = totalPrice / timePeriodNumber;
      setMonthlySavings(requiredSavings.toFixed(2));

      const savingsPercentage =
        affordabilityPlan === "very-comfortable"
          ? 0.3
          : affordabilityPlan === "comfortable"
          ? 0.5
          : 0.9;

      const allotableFunds = monthlyIncome * savingsPercentage;
      if (allotableFunds > 0) {
        
        const months = Math.ceil(totalPrice / allotableFunds);
        const APrequiredSavings = totalPrice / months

        setAffordabilityPlanSavings(APrequiredSavings.toFixed(2));
        setMonthsToSave(months);
      }
    }
  };

  return (
    <section>
      <div className="container-fluid">
        <h1 className="mt-5">Luxury Spending Calculator</h1>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Item Price"
            value={itemPrice}
            onChange={(e) => {
              const newValue = Math.max(0, parseFloat(e.target.value));
              setItemPrice(newValue.toString());
            }}
          />
        </div>

        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Time Period (in months)"
            value={timePeriod}
            onChange={(e) => {
              const newValue = Math.max(0, parseFloat(e.target.value));
              setTimePeriod(newValue.toString());
            }}
          />
        </div>

        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Monthly Expendable Income"
            value={monthlyIncome}
            onChange={(e) => {
              const newValue = Math.max(0, parseFloat(e.target.value));
              setMonthlyIncome(newValue.toString());
            }}
          />
        </div>

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

        {totalSpending > 0 && (
          <div>
            <p>
              Total Spending (including tax): ${totalSpending.toFixed(2)}
            </p>
            <p>
              Monthly Savings for {selectedTP}{" "}
              {timePeriod == 1 ? "Month" : "Months"}: ${monthlySavings}
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
      <button className="btn btn-primary" onClick={calculateTotalSpending}>
        Calculate
      </button>
    </section>
  );
}

export default Luxury;