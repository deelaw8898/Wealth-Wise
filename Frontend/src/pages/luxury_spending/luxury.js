import React, { useState } from "react";

function Luxury() {
  const [itemPrice, setItemPrice] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [totalSpending, setTotalSpending] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savingsPlan, setSavingsPlan] = useState("very-comfortable");
  const [monthsToSave, setMonthsToSave] = useState(0);

  const calculateTotalSpending = () => {
    const taxRate = 0.11;
    const itemPriceNumber = parseFloat(itemPrice);
    const timePeriodNumber = parseInt(timePeriod, 10);
    const monthlyIncomeNumber = parseFloat(monthlyIncome);

    if (
      !isNaN(itemPriceNumber) &&
      !isNaN(timePeriodNumber) &&
      !isNaN(monthlyIncomeNumber)
    ) {
      const taxAmount = itemPriceNumber * taxRate;
      const totalPrice = itemPriceNumber + taxAmount;
      setTotalSpending(totalPrice);

      const savingsPercentage =
        savingsPlan === "very-comfortable"
          ? 0.3
          : savingsPlan === "comfortable"
          ? 0.5
          : 0.9;

      const requiredSavings = (totalPrice / timePeriodNumber) * savingsPercentage;
      setMonthlySavings(requiredSavings.toFixed(2));

      if (requiredSavings > 0) {
        const months = Math.ceil(totalPrice / (monthlyIncomeNumber * savingsPercentage));
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
            onChange={(e) => setItemPrice(e.target.value)}
          />
        </div>

        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Time Period (in months)"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          />
        </div>

        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Monthly Expendable Income"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="savingsPlan">Affordability Plan:</label>
          <select
            className="form-control"
            id="savingsPlan"
            value={savingsPlan}
            onChange={(e) => setSavingsPlan(e.target.value)}
          >
            <option value="very-comfortable">Very Comfortable</option>
            <option value="comfortable">Comfortable</option>
            <option value="asap">As Soon As Possible</option>
          </select>
        </div>

        {totalSpending > 0 && (
          <div>
            <p>Total Spending (including tax): ${totalSpending.toFixed(2)}</p>
            <p>Monthly Savings Required: ${monthlySavings}</p>
            <p>Time Untill Purchese: {monthsToSave} months</p>
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