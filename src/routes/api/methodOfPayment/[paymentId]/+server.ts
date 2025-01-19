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
		if (!paymentMethod || paymentMethod.length === 0)
			return respond(404, '', 'There is no budget found.');
		return respond(200, paymentMethod);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
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
			return respond(404, '', 'There is no method of payment available');
		await db
			.update(table.PaymentMethodTable)
			.set({
				method_name: validatedData.name
			})
			.where(eq(table.PaymentMethodTable.payment_method_id, paymentId ?? ''));
		return respond(200, 'Budget updated successfull!');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'Validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { paymentId } = params;
		const paymentMethod = await db
			.select()
			.from(table.PaymentMethodTable)
			.where(eq(table.PaymentMethodTable.payment_method_id, paymentId ?? ''));
		if (!paymentMethod || paymentMethod.length === 0)
			return respond(404, '', 'Failed to find budget');
		await db
			.delete(table.PaymentMethodTable)
			.where(eq(table.PaymentMethodTable.payment_method_id, paymentId ?? ''));
		return respond(200, 'Budget Deleted successfully.');
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
