import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { expensiId } = params;
		const expense = await db
			.select()
			.from(table.ExpenseTable)
			.where(eq(table.ExpenseTable.expense_id, expensiId ?? ''));
		if (!expense || expense.length === 0) return respond('There is no such Spending', 404);
		return respond(expense, 200);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond('Validation Failed', 415);
		return respond('INTERNAL SERVER ERROR.', 500);
	}
};

export const PATCH: RequestHandler = async () => {
	try {
		// check if amount are not exced expected spending

		// update the balance
		return respond('Updated successfully', 200);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond('Validation fails', 415);
		return respond('INTERNAL SERVER ERROR.', 500);
	}
};
