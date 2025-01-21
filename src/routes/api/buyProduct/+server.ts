import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import * as table from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { and, desc, eq, gt, lt, or } from 'drizzle-orm';

const buyProductSchema = z.object({
	payment_method_id: z.string(),
	amount: z.number().nonnegative(),
	budget_list_id: z.string()
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = buyProductSchema.parse(data);
		// get current balance
		const currentBallance = await db
			.select()
			.from(table.TransactionTable)
			.orderBy(desc(table.TransactionTable.created_at))
			.limit(1);
		if (!currentBallance || currentBallance.length == 0)
			return respond(404, '', 'There is no such Transaction ever happen, please deposit first.');
		if (currentBallance[0].balance == 0 || currentBallance[0].balance < validatedData.amount)
			return respond(400, '', 'You have insuficient balance Money');
		// check if method of payment allowed
		const methodOfPayment = await db
			.select()
			.from(table.PaymentMethodTable)
			.where(eq(table.PaymentMethodTable.payment_method_id, validatedData.payment_method_id));
		if (methodOfPayment?.length == 0) return respond(404, '', 'There is no such payment method.');
		// get budget for today
		const todaysBudget = await db
			.select()
			.from(table.BudgetTable)
			.where(
				and(
					or(
						lt(table.BudgetTable.start_date, new Date()),
						eq(table.BudgetTable.start_date, new Date())
					),
					or(gt(table.BudgetTable.end_date, new Date()), eq(table.BudgetTable.end_date, new Date()))
				)
			);

		if (!todaysBudget || todaysBudget.length === 0)
			return respond(400, '', 'There is no Budget Cover To day');
		// check if the product is in todays budget
		const product = await db
			.select()
			.from(table.BudgetListTable)
			.where(
				and(
					eq(table.BudgetListTable.budget_list_id, validatedData.budget_list_id),
					eq(table.BudgetListTable.budget_id, todaysBudget[0].budget_id)
				)
			);
		if (!product || product?.length == 0)
			return respond(400, '', 'Product does not exist in todays budget');
		if (product[0].isBought) return respond(400, '', 'Product is bought');
		if (product[0].amount < validatedData.amount)
			return respond(
				400,
				'',
				`You exced ${validatedData.amount - product[0].amount} on planned budge. Process can not procced`
			);
		// create Transaction
		const expenseId = uuidv4();
		await db.insert(table.ExpenseTable).values({
			expense_id: expenseId,
			budget_list_id: validatedData.budget_list_id,
			amount: validatedData.amount
		});

		// record transaction.
		await db.insert(table.TransactionTable).values({
			transaction_id: uuidv4(),
			expense_id: expenseId,
			payment_method_id: validatedData.payment_method_id,
			balance: (currentBallance[0]?.balance ?? 0) - (validatedData?.amount ?? 0)
		});

		// update the blanace or status of the product
		if (product[0].amount - validatedData.amount == 0) {
			await db.update(table.BudgetListTable).set({
				isBought: true
			});
		} else {
			await db.update(table.BudgetListTable).set({
				amount: product[0]?.amount - validatedData?.amount
			});
		}
		return respond(200, 'Transaction accured successfully');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
