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
		if (!category || category.length == 0) return respond('There is no such category.', 404);
		await db
			.update(table.CategoryTable)
			.set({ category_name: validatedData.name, category_description: validatedData.descrition })
			.where(eq(table.CategoryTable.category_id, categoryId ?? ''));
		return respond('Category updated successfully', 200);
	} catch (error) {
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVER ERROR', 500);
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
		if (!category || category.length == 0) return respond('There is no such category.', 404);
		return respond(category, 200);
	} catch (error) {
		if (error instanceof z.ZodError) return respond(error?.errors ?? '', 4015);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { categoryId } = params;
		const category = await db
			.select()
			.from(table.CategoryTable)
			.where(eq(table.CategoryTable.category_id, categoryId ?? ''));
		if (!category || category.length == 0) return respond('Category Does not exist', 404);
		await db
			.delete(table.CategoryTable)
			.where(eq(table.CategoryTable.category_id, categoryId ?? ''));
		return respond('Category Deleted Successfuly!', 200);
	} catch (error) {
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};
