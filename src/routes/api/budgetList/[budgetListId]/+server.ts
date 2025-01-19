//budgetListId
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import respond from '$lib/helper/respond';
import { budgetListSchema } from '$lib/schemas';
import { z } from 'zod';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { budgetListId } = params;
		const budgetLIst = await db
			.select()
			.from(table.BudgetListTable)
			.where(eq(table.BudgetListTable.budget_list_id, budgetListId ?? ''));
		if (!budgetLIst || budgetLIst.length === 0) return respond(404, '', 'Failed to find budget');
		return respond(200, budgetLIst);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	try {
		const { budgetListId } = params;
		const data = await request.json();
		const validatedData = budgetListSchema.parse(data);
		const budgetList = await db
			.select()
			.from(table.BudgetListTable)
			.where(eq(table.BudgetListTable.budget_list_id, budgetListId ?? ''));
		if (!budgetList || budgetList.length === 0) return respond(404, '', 'Failed to find budget');
		await db
			.update(table.BudgetListTable)
			.set({
				budget_id: validatedData.budget_id,
				sub_category_id: validatedData.sub_category_id,
				quanity: validatedData.quantity,
				amount: validatedData.amount
			})
			.where(eq(table.BudgetListTable.budget_list_id, budgetListId ?? ''));
		return respond(200, 'Budget updated successfull!');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'Validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { budgetListId } = params;
		const budgetList = await db
			.select()
			.from(table.BudgetTable)
			.where(eq(table.BudgetListTable.budget_list_id, budgetListId ?? ''));
		if (!budgetList || budgetList.length === 0)
			return respond(404, '', 'Failed to find budget_list');
		await db
			.delete(table.BudgetListTable)
			.where(eq(table.BudgetListTable.budget_list_id, budgetListId ?? ''));
		return respond(200, 'Budget Deleted successfully.');
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
