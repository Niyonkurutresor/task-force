# Budget Management App

Welcome to the Budget Management App! This application helps users manage their budgets, track expenses, and maintain financial control effectively. Follow the guide below to understand its features and setup.

---

## Features Overview

### **Sign Up**

To start using the app, you need to sign up for an account.

### **Sign In**

- Log in with your credentials to access the user dashboard.
- The dashboard is your central hub for managing budgets, transactions, and settings.

---

## Dashboard Features

### **Budget Management**

- Navigate to the **Budget** menu on the dashboard.
- Create a new budget for a specific period by clicking **add Budget** and entering the required details.
- Once a budget is created, click on it to add products you plan to purchase during the specified period.

### **Transactions**

- To purchase products on your list, go to **Transactions** and click **Buy Product**.
- A pop-up will appear displaying products within the active budget range (including today's date).
- Enter the amount you're paying for the product.
- ### notice
- Only products added to budgets covering the current date (today) will appear in the transaction list.
- Transactions exceeding the planned budget amount will not be completed.( you will be notified)

### **Settings**

- If the product you need isn't available initially, go to the **Settings** menu.
- Use the **Sub-Categories Form** to add new products, like "Banana," and other items you wish to manage.


### **Categories**

- Access the **Categories** menu to update or delete existing categories and sub-categories.

---

## Notices

- **Budget Conflicts**: Creating a budget within a date range overlapping with an existing budget is not allowed.
- Plan your budgets carefully to avoid conflicts.

---

## Project Setup

### **Clone the Repository**

```bash
git clone https://github.com/Niyonkurutresor/task-force.git
```

### **install dependencies**

- run npm install

### **Environment Setup**

- Create a .env file in the root directory.
- Add the required environment variables.

ex:( check env.example )
DB_URL=<your-database-url>
PUBLIC_API_URL=<your-secret-key>

run migrations and run dev to start project
