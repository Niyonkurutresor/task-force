import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import { type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { budgetListSchema } from '$lib/schemas';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { and, eq } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		const budgetList = await db.select().from(table.BudgetListTable);
		if (!budgetList || budgetList.length === 0) return respond('There is no Budget.', 404);
		return respond(budgetList, 200);
	} catch (error) {
		console.log(error);
		return respond('INTERNAL SERVER ERROR.', 500);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = budgetListSchema.parse(data);
		const existOnList = await db
			.select()
			.from(table.BudgetListTable)
			.where(
				and(
					eq(table.BudgetListTable.sub_category_id, validatedData.sub_category_id),
					eq(table.BudgetListTable.budget_id, validatedData.budget_id)
				)
			);
		if (existOnList?.length > 0) return respond('Product is alredy added on the list', 400);
		await db.insert(table.BudgetListTable).values({
			budget_list_id: uuidv4(),
			budget_id: validatedData.budget_id,
			sub_category_id: validatedData.sub_category_id,
			quanity: validatedData.quantity,
			amount: validatedData.amount
		});
		return respond('Budget_list created successfully.', 200);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVER ERROR.', 500);
	}
};
