import React, { useState } from 'react';
import './vacation.css';


function Vacation(){
    const [budget, setBudget] = useState('');       //Variable for budget
    const [expenseName, setName] = useState('');    //variable for expense name
    const [expenseAmount, setAmount] = useState('');  //varaible for expense amount
    const [expenses, setExpenses] = useState([]);    //array of all the expenses added
    const [remainingBudget, setRemainingBudget] = useState(0); //variable for remaining budget
    const [expenseNameToDelete, setExpenseNameToDelete] = useState(''); //variable to delete the expense
    const [expenseTotal, setTotal] = useState(0);    //varible for the total of all the expenses
  
    /**
     * This function checks for valid input for the input given by the user
     */
  const validateInput = (value) => {
    if (value < 0) {
      alert("Enter a Valid Input");
      setTotal(0);
      setBudget('');
      return 0;
    }
    return value;
  }

  /** This function is used to the set the remaining budget to main budget limit for the initial stage
   * calculates the budget status and total simuntaneously
   */
    const validateBudget = () => {
      const parsedBudget = parseFloat(budget);
      if(isNaN(parsedBudget) || parsedBudget <= 0)
      {
        setRemainingBudget(0);
        setTotal(0);
        alert("Please check your Budget!");
      }
      else{
        setRemainingBudget(budget);
        calculateTotalExpenses();
      }
      } 

  /** This function handle the expenses entered by the user and checks if they are valid 
     * or not and displays an error message according to that
     * Case 1: input is valid:
     *      checks whether the input falls under the budget or not
     * Case 2: When the input is invalid:
     *      Display an error message
     */
  const validateExpense = () => { //setting the remaining budget limit
    const name = expenseName.toString();
    const budgetintial = budget.toString();
    if(name ===''){
      alert("Expense name is empty! Please give a name.");
    }
    else if (parseFloat(expenseAmount) > 0){
        if(remainingBudget >= expenseAmount){
            setTotal(expenseAmount);
            //addition of expense and amount to the expenses array
            setExpenses([...expenses, {name: expenseName, amount: parseFloat(expenseAmount)}]);
            budgetUpdate();
            setTotal(expenseTotal + expenseAmount);
            setAmount("");
            setName("");
        }
        else if(budgetintial === ''){
          alert("Oops! You forgot to set the budget.")
        }
        else{
            alert("You are going Over-Budget!");
        }
    }
        else{
          setAmount('')
         alert("Expense Amouunt Invalid! Please try again.");
        }
    }
    
    /** This fucntion is used to update the remaining budget after the addtion of an expense
     * 
     */
    
    const budgetUpdate = () => {
        let updatebuget = parseFloat(remainingBudget) - parseFloat(expenseAmount);
        setRemainingBudget(updatebuget); //the sum of the budget used till now
    }

    const deleteExpense = () => {
    //searching for the right expense to be deleted and creating an array of the expenses to be deleted
    const deletename = expenseNameToDelete.toString();
      if(deletename === ''){
        alert("Please enter a Name for the expense to delete!");
      }
      else{
        const deletedExpenses = expenses.filter((expense) => expense.name === expenseNameToDelete);
    //calculating the amount to be deleted
        let deletedAmount;
        if (deletedExpenses.length > 0) {
        let deletedAmount = deletedExpenses.reduce((total, expense) => total + expense.amount, 0);
        //calculation of the new remaining budget
        let newbugetremaining = remainingBudget + deletedAmount;
        setRemainingBudget(newbugetremaining);
        let newtotal = expenseTotal - deletedAmount;
        setTotal(newtotal);
        }

        else {
        deletedAmount = 0;
        let newbugetremaining = remainingBudget + deletedAmount;
        setRemainingBudget(newbugetremaining);
        let newtotal = expenseTotal - deletedAmount;
        setTotal(newtotal);
        alert("Check the expense, it doesn't exist"); //displys an erro when expense doesn't exist
        }
        //updating the expenses array
        const newarray = expenses.filter((expense) => expense.name !== expenseNameToDelete); 
        setExpenses(newarray);
        setExpenseNameToDelete('');
        setAmount('');
        setName('');
      }
  }

    

    /** This function returns the total of all the expenses
     * 
     * @returns Sum of all the expenses
     */
    const calculateTotalExpenses = () => {
        setTotal(expenses.reduce((sum, expense) => sum + expense.amount, 0));
        return expenseTotal;
      }
    
    
    /* This fucntion resets all the inputs given to the calculator 
    */
    const resetExpenses = () => {
        setExpenses([]); //deleting all the saved expenses
        setName('');    //deleting the name of expense
        setBudget('');   //deleting the budget
        setAmount('');   //deleting the amount of the expense to zero
        setRemainingBudget(0);
        setExpenseNameToDelete('')
        setTotal(0);
    }

    
return(

  <div className="Vacation">
        <div className='box'>
        <div>
          <label className='budget-label' for = "budget">Budget
          </label>
          
          <input type="number" id="budget"
                placeholder="Enter your budget"
                value={budget}
                onChange={e => setBudget(validateInput(parseFloat(e.target.value)))}/>

           <button id="set-budget" onClick={validateBudget}>Set</button>
          </div>
          <div>
          <label className ="expense-label" for="expense-name">Name</label>
          <input
          type="text"
          id="expense-name"
            placeholder="Enter expense name"
          value={expenseName}
          onChange={(e) => setName(e.target.value)}/>
        </div>
        <div>
          <label className='expense-amount' for ="expense-amount ">Amount
          </label>
          <input type="number"
                    id="expense-amount"
                    placeholder="Enter expense amount"
                    value={expenseAmount}
                    onChange={(e) => setAmount((validateInput(parseFloat(e.target.value))))}/>
          <button id="add-expense" onClick={validateExpense}>Add</button>
        </div>
        <div>
        <label className='delete-label' for = "delete-expense">Delete Expense</label>
        <input type="text" id = "delete-expense" placeholder="Name of expense" value={expenseNameToDelete} onChange={(e) => setExpenseNameToDelete(e.target.value)}/>
        <button id="delete-button" onClick={deleteExpense}>Delete</button>
        </div>
        <div>
        <br></br>
        <button id="reset-button" onClick={resetExpenses}>Reset</button>
        </div>
        </div>
        <br></br>
        <div className='print'>
        <label className='total-label' for = "total">Your Total Spending is: $ {parseFloat(expenseTotal).toFixed(2)} </label>
        <br></br>
        <label className = 'print-label' for = "budget">You still have ${remainingBudget.toFixed(2)} to spend</label>
        </div>   
        <br></br>
        <div>
        <table>
            <thead>
              <tr>
                <th>Expense Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.name}</td>
                  <td>${expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
        </div>
     
);
}

export default Vacation;
