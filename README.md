
# Wealth-Wise

A **React.js** application offering a collection of **financial calculators** and **trackers**, including **luxury spending tracking**, **monthly expense management**, **mortgage calculations**, and **vacation budgeting**.  
The app integrates with a **backend API** built with **Express.js** and **MySQL** for managing user data, transactions, and categories.

---

## Features

- **Luxury Spending Calculator**: Track and calculate unnecessary or luxury expenses.
- **Monthly Expense Manager**: Manage categorized monthly expenses, view history, and visualize spending with graphs.
- **Mortgage Calculator**: Calculate monthly mortgage payments based on loan terms, and includes **automated regression testing** for accuracy.
- **Vacation Budget Planner**: Plan vacation budgets, track expenses, and manage trip costs.
- **On-Screen Calculator**: A simple **on-screen calculator** integrated for quick calculations during usage.
- **Responsive UI** built with **React-Bootstrap** for consistent, mobile-friendly design.
- **Backend API** for user registration, login, and transaction management using **Express.js** and **MySQL**.
- **Automated Local Deployment** with **Docker Compose** for easy setup.

---

## Technologies Used

- **Frontend**: React.js, React-Bootstrap
- **Backend**: Express.js, MySQL, body-parser, cors
- **State Management**: React Hooks (`useState`)
- **Database**: MySQL
- **Containerization/Deployment**: Docker, Docker Compose
- **Testing**: Custom Regression Testing in Mortgage Calculator

---

## Installation and Setup (with Docker)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/deelaw8898/Wealth-Wise.git
   cd Wealth-Wise
   ```

2. **Start the Application Using Docker Compose**
   ```bash
   docker compose up --build
   ```

3. **Access the App**

   Open your browser and visit:
   ```
   http://localhost:3000
   ```

> The Docker setup automatically installs all dependencies and runs both the frontend and backend servers.

---

## 🚀 Backend API

### Endpoints

- **POST** `/register`: Registers a new user.
  - Body: `{ "username": "string", "password": "string", "firstName": "string", "lastName": "string", "email": "string" }`
  
- **POST** `/login`: Logs in an existing user.
  - Body: `{ "username": "string", "password": "string" }`
  
- **POST** `/transaction`: Adds a transaction for a user.
  - Body: `{ "user_id": "int", "category": "string", "amount": "decimal", "transaction_date": "YYYY-MM-DD" }`
  
- **GET** `/transactions/:userId`: Retrieves all transactions for a specific user.
  - Params: `userId` (user's unique ID)

### Database Schema

- **Users Table**: Stores user details such as username, password, first name, last name, and email.
- **Transactions Table**: Stores financial transactions linked to users, including category, amount, and transaction date.

---

## Usage Instructions

Once the app is running:

- Navigate through the various calculators and tools from the main dashboard.
- Use the **on-screen calculator** for quick calculations while managing expenses or planning.
- Input required information for tools like **luxury spending**, **monthly expenses**, and **vacation budgeting**.
- Transactions can be logged, retrieved, and analyzed via the backend API.
- Errors and invalid inputs are **handled gracefully** with real-time alerts.

---

## Component Breakdown

| Component | Purpose |
| :-------- | :------ |
| **Luxury.js** | Calculates and tracks luxury item spending. Provides totals and spending summaries. |
| **MonthlyCalculator.js** | Manages monthly expenses by category, visualizes them with graphs, and allows category editing. |
| **MortgageCalculator.js** | Computes monthly mortgage payments using standard amortization formulas. Includes an internal regression testing suite for validation. |
| **Vacation.js** | Helps plan a vacation by adding multiple expense items. Supports deleting individual expenses and recalculating totals. |
| **OnScreenCalculator.js** | Provides a simple, small calculator embedded on the UI for easy calculations during user interaction. |
| **Backend** | Handles user registration, login, and transaction management with a MySQL database using Express.js. |

---

## Testing Details

- **MortgageCalculator** includes a **custom Regression Testing** mechanism.
- Test cases validate mortgage calculations against known expected results to ensure the core calculation logic remains **accurate over time**.
- Validation messages ensure user inputs are **numerical and within reasonable ranges** for all tools.

---

## Future Improvements (Planned)

- **Authentication System** to save user data locally or on the cloud.
- **Advanced Visualizations**: Integrate charts like pie charts, bar graphs (e.g., with Chart.js or Recharts).
- **Persistent Storage**: Use LocalStorage or back-end APIs to save user entries.
- **Dark Mode** toggle and customizable themes.
- **Progressive Web App (PWA)** capabilities for offline use.

---


