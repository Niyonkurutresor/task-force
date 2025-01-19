import { type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '$lib/server/db';
import respond from '$lib/helper/respond';
import { subCategoryShema } from '$lib/schemas';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		const subCategories = await db.select().from(table.SubCategoryTable);
		if (!subCategories || subCategories.length === 0)
			return respond(404, '', 'There is no Sub category exist.');
		return respond(200, subCategories);
	} catch (error) {
		console.log(error);
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const validatedData = subCategoryShema.parse(data);
		const category = await db
			.select()
			.from(table.CategoryTable)
			.where(eq(table.CategoryTable.category_id, validatedData.category_id));
		if (!category || category?.length === 0) return respond(404, '', 'There is no such category');
		await db.insert(table.SubCategoryTable).values({
			sub_category_id: uuidv4(),
			category_id: validatedData.category_id,
			sub_category_name: validatedData.name,
			sub_category_description: validatedData.descrition
		});
		return respond(200, 'Sub-category created successfully');
	} catch (error) {
		console.log(error);
		if (error instanceof z.ZodError) return respond(415, '', 'validation failed');
		return respond(500, '', 'INTERNAL SERVER ERROR');
	}
};
