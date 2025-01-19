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
		if (!categories || categories?.length === 0)
			return respond(404, '', 'Failed to find categories');
		return respond(200, categories);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return respond(415, 'validation failed');
		}
		return respond(500, '', 'INTERNAL SERVER ERROR');
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
		return respond(200, 'Category created successfully.');
	} catch (error) {
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
