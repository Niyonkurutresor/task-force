import { type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import respond from '$lib/helper/respond';
import { subCategoryShema } from '$lib/schemas';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { subcategoryId } = params;
		const [subCategory] = await db
			.select()
			.from(table.SubCategoryTable)
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		if (!subCategory) return respond('There is no such sub-category.', 404);
		return respond(subCategory, 200);
	} catch (error) {
		if (error instanceof z.ZodError) return respond(error?.errors ?? '', 4015);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const { subcategoryId } = params;
		const data = await request.json();
		const validatedData = subCategoryShema.parse(data);
		const [category] = await db
			.select()
			.from(table.CategoryTable)
			.where(eq(table.CategoryTable.category_id, validatedData.category_id));
		if (!category) return respond('There is no category with such id', 404);
		const subCategory = await db
			.select({
				category_id: table.SubCategoryTable.category_id,
				category_name: table.SubCategoryTable.sub_category_name,
				category_description: table.SubCategoryTable.sub_category_description
			})
			.from(table.SubCategoryTable)
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		if (!subCategory || subCategory.length == 0)
			return respond('There is no such sub-category.', 404);
		await db
			.update(table.SubCategoryTable)
			.set({
				sub_category_name: validatedData.name,
				sub_category_description: validatedData.descrition
			})
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		return respond('Sub-category updated successfyll!', 200);
	} catch (error) {
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { subcategoryId } = params;
		const subCategory = await db
			.select()
			.from(table.SubCategoryTable)
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		if (!subCategory || subCategory.length == 0) return respond('Sub-category Does not exist', 404);
		await db
			.delete(table.SubCategoryTable)
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		return respond('Sub-category Deleted Successfuly!', 200);
	} catch (error) {
		if (error instanceof z.ZodError) return respond('validation failed', 415);
		return respond('INTERNAL SERVER ERROR', 500);
	}
};
