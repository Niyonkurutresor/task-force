//budgetListId
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import respond from '$lib/helper/respond';
import { methodOfPaymentSchema } from '$lib/schemas';
import { z } from 'zod';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { paymentId } = params;
		const paymentMethod = await db
			.select()
			.from(table.PaymentMethodTable)
			.where(eq(table.PaymentMethodTable.payment_method_id, paymentId ?? ''));
		if (!paymentMethod || paymentMethod.length === 0) return respond('Failed to find budget', 404);
		return respond(paymentMethod, 200);
	} catch (error) {
		console.log(error);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	try {
		const { paymentId } = params;
		const data = await request.json();
		const validatedData = methodOfPaymentSchema.parse(data);
		const paymentMethod = await db
			.select()
			.from(table.PaymentMethodTable)
			.where(eq(table.PaymentMethodTable.payment_method_id, paymentId ?? ''));
		if (!paymentMethod || paymentMethod.length === 0)
			return respond('There is no method of payment available', 404);
		await db
			.update(table.PaymentMethodTable)
			.set({
				method_name: validatedData.name
			})
			.where(eq(table.PaymentMethodTable.payment_method_id, paymentId ?? ''));
		return respond('Budget updated successfull!', 200);
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond('Validation failed', 415);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { paymentId } = params;
		const paymentMethod = await db
			.select()
			.from(table.PaymentMethodTable)
			.where(eq(table.PaymentMethodTable.payment_method_id, paymentId ?? ''));
		if (!paymentMethod || paymentMethod.length === 0) return respond('Failed to find budget', 404);
		await db
			.delete(table.PaymentMethodTable)
			.where(eq(table.PaymentMethodTable.payment_method_id, paymentId ?? ''));
		return respond('Budget Deleted successfully.', 200);
	} catch (error) {
		console.log(error);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};
