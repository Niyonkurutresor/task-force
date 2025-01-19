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
		if (!expense || expense.length === 0) return respond(404, '', 'There is no such Spending');
		return respond(200, expense);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'Validation Failed');
		return respond(500, '', 'INTERNAL SERVER ERROR.');
	}
};

export const PATCH: RequestHandler = async () => {
	try {
		// check if amount are not exced expected spending

		// update the balance
		return respond(200, 'Updated successfully');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'Validation fails');
		return respond(500, '', 'INTERNAL SERVER ERROR.');
	}
};
