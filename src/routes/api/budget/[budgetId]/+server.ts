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
		if (!budget || budget.length === 0) return respond('Failed to find budget', 404);
		return respond(budget, 200);
	} catch (error) {
		console.log(error);
		return respond('INTERNAL SERVER ERROR', 500);
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
		if (!budget || budget.length === 0) return respond('Failed to find budget', 404);
		await db
			.update(table.BudgetTable)
			.set({
				budget_name: validatedData.name,
				Budget_description: validatedData.descrition,
				start_date: validatedData.start_date,
				end_date: validatedData.end_date
			})
			.where(eq(table.BudgetTable.budget_id, budgetId ?? ''));
		return respond('Budget updated successfull!', 200);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond('Validation failed', 415);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { budgetId } = params;
		const budget = await db
			.select()
			.from(table.BudgetTable)
			.where(eq(table.BudgetTable.budget_id, budgetId ?? ''));
		if (!budget || budget.length === 0) return respond('Failed to find budget', 404);
		await db.delete(table.BudgetTable).where(eq(table.BudgetTable.budget_id, budgetId ?? ''));
		return respond('Budget Deleted successfully.', 200);
	} catch (error) {
		console.log(error);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};
