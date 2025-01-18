import { z } from 'zod';

export const categoryShema = z.object({
	name: z
		.string()
		.min(3, 'Category Name must be at least 3 characters')
		.max(255, 'Category Name cannot exceed 255 characters'),

	descrition: z.string().min(3, 'Description must be at least 3 characters').optional()
});

export const subCategoryShema = z.object({
	name: z
		.string()
		.min(3, 'Sub-category Name must be at least 3 characters')
		.max(255, 'Sub-category Name cannot exceed 255 characters'),
	category_id: z.string().nonempty(),
	descrition: z.string().min(3, 'Description must be at least 3 characters').optional()
});

export const budgetSchema = z.object({
	start_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
	end_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
	name: z.string().nonempty().optional(),
	descrition: z.string().min(3, 'Description must be at least 3 characters').optional()
});

export const budgetListSchema = z.object({
	sub_category_id: z.string().nonempty(),
	budget_id: z.string().nonempty(),
	quantity: z.number().nonnegative(),
	amount: z.number().nonnegative()
});

export const expenseSchema = z.object({
	budget_list_id: z.string().nonempty(),
	amount: z.number().nonnegative()
});

export const TransactionSchema = z.object({
	income: z.number().nonnegative().optional(),
	expense_id: z.string().optional(),
	payment_method_id: z.string()
});

export const methodOfPaymentSchema = z.object({
	name: z.string().nonempty().min(2, 'Name must be more than two characters')
});

export const userSchema = z.object({
	user_name: z.string().min(3, 'Name must be more than three charactors'),
	password: z
		.string()
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, { message: 'Invalid password' })
});
