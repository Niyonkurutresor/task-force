import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import respond from '$lib/helper/respond';
import { lt, gt, and, or, eq } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		const results = await db
			.select()
			.from(table.BudgetTable)
			.where(
				and(
					or(
						lt(table.BudgetTable.start_date, new Date()),
						eq(table.BudgetTable.start_date, new Date())
					),
					or(gt(table.BudgetTable.end_date, new Date()), eq(table.BudgetTable.end_date, new Date()))
				)
			);

		if (results.length === 0) return respond(400, '', 'There is no Budget Cover To day');
		const budgetList = await db
			.select({
				budget_list_id: table.BudgetListTable.budget_list_id,
				amount: table.BudgetListTable.amount,
				quantity: table.BudgetListTable.quanity,
				product_name: table.SubCategoryTable.sub_category_name
			})
			.from(table.BudgetListTable)
			.leftJoin(
				table.SubCategoryTable,
				eq(table.SubCategoryTable.sub_category_id, table.BudgetListTable.sub_category_id)
			)
			.where(
				and(
					eq(table.BudgetListTable.budget_id, results[0].budget_id),
					eq(table.BudgetListTable.isBought, false)
				)
			);
		if (!budgetList || budgetList.length === 0)
			return respond(404, '', 'There is no List on selected budget.');
		return respond(200, budgetList);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR.');
	}
};
