import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import * as table from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
export const GET: RequestHandler = async () => {
	try {
		const transactions = await db
			.select({
				transaction_id: table.TransactionTable.transaction_id,
				income: table.TransactionTable.income,
				expense: table.ExpenseTable.amount,
				payment_method: table.PaymentMethodTable.method_name,
				created_at: table.TransactionTable.created_at
			})
			.from(table.TransactionTable)
			.leftJoin(
				table.ExpenseTable,
				eq(table.ExpenseTable.expense_id, table.TransactionTable.expense_id)
			)
			.leftJoin(
				table.PaymentMethodTable,
				eq(table.PaymentMethodTable.payment_method_id, table.TransactionTable.payment_method_id)
			)
			.orderBy(desc(table.TransactionTable.created_at))
			.limit(5);

		const formattedTransactions = transactions.map((transaction) => {
			// Calculate  time
			const date = new Date(transaction.created_at);
			const now = new Date();
			const diffTime = Math.abs(now.getTime() - date.getTime());
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

			let timeDescription;
			if (diffDays === 0) {
				timeDescription = 'Today';
			} else if (diffDays === 1) {
				timeDescription = 'Yesterday';
			} else {
				timeDescription = `${diffDays} days ago`;
			}

			//  format amount
			const amount = transaction.income || -Math.abs(transaction.expense || 0);
			const formattedAmount =
				amount >= 0 ? `+$${amount.toLocaleString()}` : `-$${Math.abs(amount).toLocaleString()}`;

			return {
				id: transaction.transaction_id,
				title: transaction.payment_method,
				description: timeDescription,
				amount: formattedAmount,
				date: transaction.created_at,
				isIncome: amount >= 0
			};
		});

		if (!formattedTransactions || formattedTransactions.length === 0) {
			return respond(404, '', 'No transactions found');
		}

		return respond(200, {
			transactions: formattedTransactions,
			totalCount: formattedTransactions.length
		});
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
