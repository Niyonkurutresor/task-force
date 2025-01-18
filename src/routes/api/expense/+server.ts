import respond from '$lib/helper/respond';
import { expenseSchema } from '$lib/schemas';
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import * as table from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = expenseSchema.parse(data);
		const existInBudgetList = await db
			.select()
			.from(table.BudgetListTable)
			.where(eq(table.BudgetListTable.budget_list_id, validatedData.budget_list_id));
		if (!existInBudgetList || existInBudgetList.length === 0)
			return respond('There is no such budget list.', 404);
		if (existInBudgetList[0].isBought === true) return respond('The product is bought', 400);
		// check the balance on his account
		await db.insert(table.ExpenseTable).values({
			expense_id: uuidv4(),
			budget_list_id: validatedData.budget_list_id,
			amount: validatedData.amount
		});
		// reduce the balance

		// update the product list
		await db
			.update(table.BudgetListTable)
			.set({
				isBought: true
			})
			.where(eq(table.BudgetListTable.budget_list_id, validatedData.budget_list_id));

		return respond('Expense created successfully', 200);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};
