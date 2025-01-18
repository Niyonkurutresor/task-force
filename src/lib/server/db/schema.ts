import { sql } from 'drizzle-orm';
import {
	mysqlTable,
	varchar,
	datetime,
	int,
	text,
	date,
	timestamp,
	boolean
} from 'drizzle-orm/mysql-core';

/**
 * ****************** start of enum**********************************
 */

// const UserRoleEnum = mysqlEnum('User_role', ['ADMIN', 'STAFF', 'VIEWRS']);

/**
 *  ***************************** end of enum************************
 */

export const UserTable = mysqlTable('user', {
	user_id: varchar('user_id', { length: 255 }).primaryKey().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const CategoryTable = mysqlTable('category', {
	category_id: varchar('category_id', { length: 255 }).primaryKey().notNull(),
	category_name: varchar('category_name', { length: 255 }).notNull(),
	category_description: varchar('category_description', { length: 255 }),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const SubCategoryTable = mysqlTable('sub_category', {
	sub_category_id: varchar('sub_category_id', { length: 255 }).primaryKey().notNull(),
	category_id: varchar('category_id', { length: 255 })
		.references(() => CategoryTable.category_id, { onDelete: 'cascade' })
		.notNull(),
	sub_category_name: varchar('sub_category_name', { length: 255 }).notNull(),
	sub_category_description: varchar('sub_category_description', { length: 225 }),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const BudgetTable = mysqlTable('budget', {
	budget_id: varchar('budget_id', { length: 255 }).primaryKey().notNull(),
	start_date: date('start_date').notNull(),
	end_date: date('end_date').notNull(),
	budget_name: varchar('budget_name', { length: 255 }),
	Budget_description: text('Budget_description'),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const BudgetListTable = mysqlTable('budget_list', {
	budget_list_id: varchar('budget_list_id', { length: 255 }).primaryKey().notNull(),
	budget_id: varchar('budget_id', { length: 255 })
		.references(() => BudgetTable.budget_id, { onDelete: 'cascade' })
		.notNull(),
	sub_category_id: varchar('sub_category_id', { length: 255 })
		.references(() => SubCategoryTable.sub_category_id, { onDelete: 'cascade' })
		.notNull(),
	amount: int('amount').notNull(),
	quanity: int('quantity').notNull(),
	isBought: boolean('status').default(false),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const ExpenseTable = mysqlTable('expense', {
	expense_id: varchar('expense_id', { length: 255 }).primaryKey().notNull(),
	budget_list_id: varchar('budget_list_id', { length: 255 })
		.references(() => BudgetListTable.budget_list_id, { onDelete: 'cascade' })
		.notNull(),
	amount: int('amount').notNull(),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const PaymentMethodTable = mysqlTable('payment_method', {
	payment_method_id: varchar('payment_method_id', { length: 255 }).primaryKey().notNull(),
	method_name: varchar('method_name', { length: 255 }).notNull(),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});
export const TransactionTable = mysqlTable('transaction', {
	transaction_id: varchar('transaction_account_id', { length: 255 }).primaryKey().notNull(),
	income: int('income'),
	expense_id: varchar('expense_id', { length: 255 }),
	payment_method_id: varchar('payment_method_id', { length: 255 })
		.references(() => PaymentMethodTable.payment_method_id, { onDelete: 'cascade' })
		.notNull(),
	balance: int('balance').notNull(),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey().notNull(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => UserTable.user_id, { onDelete: 'cascade' }),
	expiresAt: datetime('expires_at').notNull(),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export type Session = typeof session.$inferSelect;

export type User = typeof UserTable.$inferSelect;
