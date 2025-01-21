import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import { type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { budgetSchema } from '$lib/schemas';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { desc, gt } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		const budget = await db
			.select()
			.from(table.BudgetTable)
			.orderBy(desc(table.BudgetTable.start_date));
		if (!budget || budget.length === 0) return respond(404, '', 'Failed to find budget');
		return respond(200, budget);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVERrr ERROR.');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = budgetSchema.parse(data);
		// find budget ini selected period
		const results = await db
			.select()
			.from(table.BudgetTable)
			.where(gt(table.BudgetTable.end_date, validatedData.end_date));
		if (results.length > 0) return respond(400, '', 'There is other budget in selected range');
		await db.insert(table.BudgetTable).values({
			budget_id: uuidv4(),
			budget_name: validatedData.name,
			Budget_description: validatedData.descrition,
			start_date: validatedData.start_date,
			end_date: validatedData.end_date
		});
		return respond(200, 'Budget created successfully.');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVERrr ERROR.');
	}
};
