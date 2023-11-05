import React, { useState } from "react";

function Luxury() {
  const [itemPrice, setItemPrice] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [totalSpending, setTotalSpending] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);

  const calculateTotalSpending = () => {
    const taxRate = 0.1; // 10% tax rate
    const itemPriceNumber = parseFloat(itemPrice);
    const timePeriodNumber = parseInt(timePeriod, 10);

    if (!isNaN(itemPriceNumber) && !isNaN(timePeriodNumber)) {
      const taxAmount = itemPriceNumber * taxRate;
      const totalPrice = itemPriceNumber + taxAmount;
      setTotalSpending(totalPrice);

      const requiredSavings = totalPrice / timePeriodNumber;
      setMonthlySavings(requiredSavings.toFixed(2));
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

        {totalSpending > 0 && (
          <div>
            <p>Total Spending (including tax): ${totalSpending.toFixed(2)}</p>
            <p>Monthly Savings Required: ${monthlySavings}</p>
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