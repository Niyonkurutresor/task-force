import { type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '$lib/server/db';
import respond from '$lib/helper/respond';
import { categoryShema } from '$lib/schemas';

export const GET: RequestHandler = async () => {
	try {
		const categories = await db.select().from(table.CategoryTable);
		if (!categories || categories?.length === 0) return respond('Failed to find categories', 404);
		return respond(categories, 200);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return respond('validation failed', 415);
		}
		return respond('INTERNAL SERVER ERROR', 500);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = categoryShema.parse(data);
		await db.insert(table.CategoryTable).values({
			category_id: uuidv4(),
			category_name: validatedData.name,
			category_description: validatedData.descrition
		});
		return respond('Category created successfully.', 200);
	} catch (error) {
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};
