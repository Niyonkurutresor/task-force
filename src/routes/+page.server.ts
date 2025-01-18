import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schemas';

export const load: PageServerLoad = async (event) => {
	const loginForm = await superValidate(zod(userSchema));
	const signupForm = await superValidate(zod(userSchema));

	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	return { loginForm, signupForm };
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event.request, zod(userSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const results = await db
				.select()
				.from(table.UserTable)
				.where(eq(table.UserTable.name, form.data.user_name));

			const existingUser = results.at(0);
			if (!existingUser) {
				return message(form, 'Incorrect username or password');
			}

			const validPassword = await verify(existingUser.password, form.data.password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			if (!validPassword) {
				return message(form, 'Incorrect username or password');
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, existingUser.user_id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
			throw redirect(302, '/dashboard');
		} catch (error) {
			console.log(error);
			return fail(500, { form, message: 'Login failed' });
		}
	},
	signup: async (event) => {
		const form = await superValidate(event.request, zod(userSchema));
		if (!form.valid) return fail(400, { form });
		const { password, user_name } = form.data;
		const userId = uuidv4();
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			const user = await db
				.select()
				.from(table.UserTable)
				.where(eq(table.UserTable.name, user_name));

			if (user.length > 0) {
				return fail(400, { form, message: 'Invalid username' });
			}
			await db.insert(table.UserTable).values({
				user_id: userId,
				name: user_name,
				password: passwordHash
			});
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			console.log(e);
			return fail(500, { form, message: 'An error has occurred' });
		}
		throw redirect(302, '/dashboard');
	}
};
