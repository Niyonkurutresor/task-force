import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import * as table from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { desc, eq } from 'drizzle-orm';

const addMoneySchema = z.object({
	income: z.number().nonnegative().optional(),
	payment_method_id: z.string()
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = addMoneySchema.parse(data);
		// get current balance
		const currentBallance = await db
			.select()
			.from(table.TransactionTable)
			.orderBy(desc(table.TransactionTable.created_at))
			.limit(1);

		// check if initial balance method of payment allowed
		const methodOfPayment = await db
			.select()
			.from(table.PaymentMethodTable)
			.where(eq(table.PaymentMethodTable.payment_method_id, validatedData.payment_method_id));
		if (methodOfPayment?.length == 0) return respond(404, '', 'There is no such payment method.');
		// record transaction.
		await db.insert(table.TransactionTable).values({
			transaction_id: uuidv4(),
			income: validatedData.income,
			payment_method_id: validatedData.payment_method_id,
			balance: currentBallance[0]
				? (currentBallance[0]?.balance ?? 0) + (validatedData?.income ?? 0)
				: (validatedData?.income ?? 0)
		});
		return respond(200, 'Transaction accured successfully');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
