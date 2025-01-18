import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import { type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { budgetSchema } from '$lib/schemas';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const GET: RequestHandler = async () => {
	try {
		const budget = await db.select().from(table.BudgetTable);
		if (!budget || budget.length === 0) return respond('Failed to find budget', 404);
		return respond(budget, 200);
	} catch (error) {
		console.log(error);
		return respond('INTERNAL SERVER ERROR.', 500);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = budgetSchema.parse(data);
		await db.insert(table.BudgetTable).values({
			budget_id: uuidv4(),
			budget_name: validatedData.name,
			Budget_description: validatedData.descrition,
			start_date: validatedData.start_date,
			end_date: validatedData.end_date
		});
		return respond('Budget created successfully.', 200);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVERrr ERROR.', 500);
	}
};
