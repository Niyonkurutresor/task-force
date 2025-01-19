import respond from '$lib/helper/respond';
import { TransactionSchema } from '$lib/schemas';
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import * as table from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { desc, eq } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		const transactions = await db
			.select({
				transaction_id: table.TransactionTable.transaction_id,
				income: table.TransactionTable.income,
				expanse: table.ExpenseTable.amount,
				balance: table.TransactionTable.balance,
				payment_method: table.PaymentMethodTable.method_name,
				date: table.TransactionTable.created_at
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
			.orderBy(desc(table.TransactionTable.created_at));

		if (!transactions || transactions.length === 0)
			return respond(404, '', 'Failed to find budget');
		return respond(200, transactions);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVERrr ERROR.');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = TransactionSchema.parse(data);

		// get current balance
		let currentBallance = await db
			.select()
			.from(table.TransactionTable)
			.orderBy(desc(table.TransactionTable.created_at))
			.limit(1);
		if (!currentBallance || currentBallance.length == 0) {
			// record one for initial
			await db.insert(table.TransactionTable).values({
				transaction_id: uuidv4(),
				income: 0,
				expense_id: '',
				payment_method_id: validatedData.payment_method_id,
				balance: 0
			});
			currentBallance = await db
				.select()
				.from(table.TransactionTable)
				.orderBy(desc(table.TransactionTable.created_at))
				.limit(1);
		}
		// record transaction.
		await db.insert(table.TransactionTable).values({
			transaction_id: uuidv4(),
			income: validatedData.income,
			expense_id: validatedData.expense_id,
			payment_method_id: validatedData.payment_method_id,
			balance: currentBallance[0].balance + (validatedData?.income ?? 0)
		});
		return respond(200, 'Transaction accured successfully');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
