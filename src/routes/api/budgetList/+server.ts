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
		if (!budgetList || budgetList.length === 0) return respond(404, '', 'There is no Budget.');
		return respond(200, budgetList);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR.');
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
		if (existOnList?.length > 0) return respond(400, '', 'Product is alredy added on the list');
		await db.insert(table.BudgetListTable).values({
			budget_list_id: uuidv4(),
			budget_id: validatedData.budget_id,
			sub_category_id: validatedData.sub_category_id,
			quanity: validatedData.quantity,
			amount: validatedData.amount
		});
		return respond(200, 'Budget_list created successfully.');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR.');
	}
};
