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
		if (!subCategory) return respond(404, '', 'There is no such sub-category.');
		return respond(200);
	} catch (error) {
		if (error instanceof z.ZodError) return respond(4015, '', error?.errors ?? '');
		return respond(500, '', 'INTERNAL SERVER ERROR');
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
		if (!category) return respond(404, '', 'There is no category with such id');
		const subCategory = await db
			.select({
				category_id: table.SubCategoryTable.category_id,
				category_name: table.SubCategoryTable.sub_category_name,
				category_description: table.SubCategoryTable.sub_category_description
			})
			.from(table.SubCategoryTable)
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		if (!subCategory || subCategory.length == 0)
			return respond(404, '', 'There is no such sub-category.');
		await db
			.update(table.SubCategoryTable)
			.set({
				sub_category_name: validatedData.name,
				sub_category_description: validatedData.descrition
			})
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		return respond(200, 'Sub-category updated successfyll!');
	} catch (error) {
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { subcategoryId } = params;
		const subCategory = await db
			.select()
			.from(table.SubCategoryTable)
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		if (!subCategory || subCategory.length == 0)
			return respond(404, '', 'Sub-category Does not exist');
		await db
			.delete(table.SubCategoryTable)
			.where(eq(table.SubCategoryTable.sub_category_id, subcategoryId ?? ''));
		return respond(200, 'Sub-category Deleted Successfuly!');
	} catch (error) {
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
