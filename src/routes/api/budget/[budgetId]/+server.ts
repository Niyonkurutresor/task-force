import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import respond from '$lib/helper/respond';
import { budgetSchema } from '$lib/schemas';
import { z } from 'zod';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { budgetId } = params;
		const budget = await db
			.select()
			.from(table.BudgetTable)
			.where(eq(table.BudgetTable.budget_id, budgetId ?? ''));
		if (!budget || budget.length === 0) return respond(404, '', 'Failed to find budget');
		return respond(200, budget);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	try {
		const { budgetId } = params;
		const data = await request.json();
		const validatedData = budgetSchema.parse(data);
		const budget = await db
			.select()
			.from(table.BudgetTable)
			.where(eq(table.BudgetTable.budget_id, budgetId ?? ''));
		if (!budget || budget.length === 0) return respond(404, '', 'Failed to find budget');
		await db
			.update(table.BudgetTable)
			.set({
				budget_name: validatedData.name,
				Budget_description: validatedData.descrition,
				start_date: validatedData.start_date,
				end_date: validatedData.end_date
			})
			.where(eq(table.BudgetTable.budget_id, budgetId ?? ''));
		return respond(200, 'Budget updated successfull!');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'Validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { budgetId } = params;
		const budget = await db
			.select()
			.from(table.BudgetTable)
			.where(eq(table.BudgetTable.budget_id, budgetId ?? ''));
		if (!budget || budget.length === 0) return respond(404, '', 'Failed to find budget');
		await db.delete(table.BudgetTable).where(eq(table.BudgetTable.budget_id, budgetId ?? ''));
		return respond(200, 'Budget Deleted successfully.');
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
