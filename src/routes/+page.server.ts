import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schemas';

const ARGON2_OPTIONS = {
	memoryCost: 16384,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
} as const;

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	const [loginForm, signupForm] = await Promise.all([
		superValidate(zod(userSchema)),
		superValidate(zod(userSchema))
	]);

	return { loginForm, signupForm };
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event.request, zod(userSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const user = await db
				.select()
				.from(table.UserTable)
				.where(eq(table.UserTable.name, form.data.user_name))
				.limit(1)
				.then((results) => results[0]);

			if (!user) {
				form.message = 'Invalid credentials';
				return fail(400, { form });
			}

			const validPassword = await verify(user.password, form.data.password, ARGON2_OPTIONS);
			if (!validPassword) {
				form.message = 'Invalid credentials';
				return fail(400, { form });
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, user.user_id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			throw redirect(302, '/dashboard');
		} catch (error) {
			console.error('Login error:', error);
			form.message = 'An unexpected error occurred. Please try again.';
			return fail(500, { form });
		}
	},

	signup: async (event) => {
		const form = await superValidate(event.request, zod(userSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { password, user_name } = form.data;
		const userId = uuidv4();

		try {
			const [existingUser, passwordHash] = await Promise.all([
				db
					.select()
					.from(table.UserTable)
					.where(eq(table.UserTable.name, user_name))
					.limit(1)
					.then((results) => results[0]),
				hash(password, ARGON2_OPTIONS)
			]);

			if (existingUser) {
				form.message = `User "${user_name}" already exists. Please choose a different username.`;
				return fail(400, { form });
			}

			await db.insert(table.UserTable).values({
				user_id: userId,
				name: user_name,
				password: passwordHash
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			throw redirect(302, '/dashboard');
		} catch (error) {
			console.error('Signup error:', error);
			form.message = 'An unexpected error occurred during signup. Please try again.';
			return fail(500, { form });
		}
	}
};
