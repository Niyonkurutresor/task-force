import respond from '$lib/helper/respond';
import { db } from '$lib/server/db';
import { type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { methodOfPaymentSchema } from '$lib/schemas';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const GET: RequestHandler = async () => {
	try {
		const methods = await db.select().from(table.PaymentMethodTable);
		if (!methods || methods.length === 0) return respond('There is no any Method', 404);
		return respond(methods, 200);
	} catch (error) {
		console.log(error);
		return respond('INTERNAL SERVER ERROR.', 500);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = methodOfPaymentSchema.parse(data);
		await db.insert(table.PaymentMethodTable).values({
			payment_method_id: uuidv4(),
			method_name: validatedData.name
		});
		return respond('Payment method created successfully.', 200);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVER ERROR.', 500);
	}
};
