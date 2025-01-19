import respond from '$lib/helper/respond';
import { TransactionSchema } from '$lib/schemas';
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import * as table from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { desc } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = TransactionSchema.parse(data);

		// get current balance
		let currentBallance = await db
			.select()
			.from(table.TransactionTable)
			.orderBy(desc(table.TransactionTable.created_at))
			.limit(1);
		if (!currentBallance || currentBallance.length == 0) {
			// record one for initial
			await db.insert(table.TransactionTable).values({
				transaction_id: uuidv4(),
				income: 0,
				expense_id: '',
				payment_method_id: validatedData.payment_method_id,
				balance: 0
			});
			currentBallance = await db
				.select()
				.from(table.TransactionTable)
				.orderBy(desc(table.TransactionTable.created_at))
				.limit(1);
		}
		// record transaction.
		await db.insert(table.TransactionTable).values({
			transaction_id: uuidv4(),
			income: validatedData.income,
			expense_id: validatedData.expense_id,
			payment_method_id: validatedData.payment_method_id,
			balance: currentBallance[0].balance + (validatedData?.income ?? 0)
		});
		return respond(200, 'Transaction accured successfully');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
