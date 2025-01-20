import respond from '$lib/helper/respond';
import type { RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { and, eq, gte, lte } from 'drizzle-orm';
export const GET: RequestHandler = async () => {
	try {
		const now = new Date();
		const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

		const currentMonthTransactions = await db
			.select({
				income: table.TransactionTable.income,
				expense: table.ExpenseTable.amount,
				balance: table.TransactionTable.balance,
				created_at: table.TransactionTable.created_at
			})
			.from(table.TransactionTable)
			.leftJoin(
				table.ExpenseTable,
				eq(table.ExpenseTable.expense_id, table.TransactionTable.expense_id)
			)
			.where(gte(table.TransactionTable.created_at, firstDayOfMonth));

		const lastMonthTransactions = await db
			.select({
				income: table.TransactionTable.income,
				expense: table.ExpenseTable.amount,
				balance: table.TransactionTable.balance,
				created_at: table.TransactionTable.created_at
			})
			.from(table.TransactionTable)
			.leftJoin(
				table.ExpenseTable,
				eq(table.ExpenseTable.expense_id, table.TransactionTable.expense_id)
			)
			.where(
				and(
					gte(table.TransactionTable.created_at, firstDayOfLastMonth),
					lte(table.TransactionTable.created_at, lastDayOfLastMonth)
				)
			);

		const currentBudget = await db
			.select({
				amount: table.BudgetListTable.amount
			})
			.from(table.BudgetListTable)
			.innerJoin(
				table.BudgetTable,
				eq(table.BudgetTable.budget_id, table.BudgetListTable.budget_id)
			)
			.where(and(lte(table.BudgetTable.start_date, now), gte(table.BudgetTable.end_date, now)));

		const currentTotalIncome = currentMonthTransactions.reduce(
			(sum, t) => sum + (t.income || 0),
			0
		);
		const lastTotalIncome = lastMonthTransactions.reduce((sum, t) => sum + (t.income || 0), 0);
		const currentTotalExpenses = currentMonthTransactions.reduce(
			(sum, t) => sum + (t.expense || 0),
			0
		);
		const lastTotalExpenses = lastMonthTransactions.reduce((sum, t) => sum + (t.expense || 0), 0);
		const currentBalance = currentMonthTransactions[0]?.balance || 0;
		const totalBudget = currentBudget.reduce((sum, b) => sum + b.amount, 0);

		const incomeChange = ((currentTotalIncome - lastTotalIncome) / lastTotalIncome) * 100;
		const expenseChange = ((currentTotalExpenses - lastTotalExpenses) / lastTotalExpenses) * 100;
		const savings = currentTotalIncome - currentTotalExpenses;
		const lastSavings = lastTotalIncome - lastTotalExpenses;
		const savingsChange = ((savings - lastSavings) / lastSavings) * 100;
		const budgetUsagePercent = (currentTotalExpenses / totalBudget) * 100;

		const dashboardData = [
			{
				title: 'Total Balance',
				amount: `$${currentBalance.toLocaleString()}`,
				change: `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}% from last month`,
				isPositive: incomeChange >= 0
			},
			{
				title: 'Total Expenses',
				amount: `$${currentTotalExpenses.toLocaleString()}`,
				change: `${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}% from last month`,
				isPositive: expenseChange <= 0
			},
			{
				title: 'Total Savings',
				amount: `$${savings.toLocaleString()}`,
				change: `${savingsChange >= 0 ? '+' : ''}${savingsChange.toFixed(1)}% from last month`,
				isPositive: savingsChange >= 0
			},
			{
				title: 'Budget Status',
				amount: `$${currentTotalExpenses.toLocaleString()}`,
				change: `${budgetUsagePercent.toFixed(1)}% of monthly budget`,
				isPositive: budgetUsagePercent <= 75
			}
		];

		return respond(200, dashboardData);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
