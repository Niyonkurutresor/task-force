import { type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import respond from '$lib/helper/respond';
import { categoryShema } from '$lib/schemas';

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const { categoryId } = params;
		const data = await request.json();
		const validatedData = categoryShema.parse(data);
		const category = await db
			.select()
			.from(table.CategoryTable)
			.where(eq(table.CategoryTable.category_id, categoryId ?? ''));
		if (!category || category.length == 0) return respond(404, '', 'There is no such category.');
		await db
			.update(table.CategoryTable)
			.set({ category_name: validatedData.name, category_description: validatedData.descrition })
			.where(eq(table.CategoryTable.category_id, categoryId ?? ''));
		return respond(200, 'Category updated successfully');
	} catch (error) {
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { categoryId } = params;
		const category = await db
			.select({
				category_id: table.CategoryTable.category_id,
				category_name: table.CategoryTable.category_name,
				category_description: table.CategoryTable.category_description
			})
			.from(table.CategoryTable)
			.where(eq(table.CategoryTable.category_id, categoryId ?? ''));
		if (!category || category.length == 0) return respond(404, '', 'There is no such category.');
		return respond(200, category);
	} catch (error) {
		if (error instanceof z.ZodError) return respond(4015, '', error?.errors ?? '');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { categoryId } = params;
		const category = await db
			.select()
			.from(table.CategoryTable)
			.where(eq(table.CategoryTable.category_id, categoryId ?? ''));
		if (!category || category.length == 0) return respond(404, '', 'Category Does not exist');
		await db
			.delete(table.CategoryTable)
			.where(eq(table.CategoryTable.category_id, categoryId ?? ''));
		return respond(200, 'Category Deleted Successfuly!');
	} catch (error) {
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
