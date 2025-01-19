//subcategoryId

import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { budgetId } = params;
		const budgetLIst = await db
			.select()
			.from(table.BudgetListTable)
			.where(and(eq(table.BudgetListTable.budget_id, budgetId ?? '')));
		if (!budgetLIst || budgetLIst.length === 0) return respond(404, '', 'Failed to find budget');
		return respond(200, budgetLIst);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
