<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';
	let form: ActionData = null;
	export let data: PageData;
	let { error, message } = form ?? { error: '', message: '' };
	$: ({ error, message } = form ?? { error: '', message: '' });
	$: console.log(error, message);
	const {
		form: loginForm,
		errors: loginErrors,
		enhance: loginEnhance,
		message: loginMessage,
		submitting: loginSubmitting
	} = superForm(data.loginForm, {
		resetForm: false,
		clearOnSubmit: 'none',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				showLoginModal = false;
			}
		}
	});

	const {
		form: signupForm,
		errors: signupErrors,
		enhance: signupEnhance,
		message: signupMessage,
		submitting: signupSubmitting
	} = superForm(data.signupForm, {
		resetForm: false,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				showSignupModal = false;
			}
		}
	});
	let showLoginModal = false;
	let showSignupModal = false;
	const closeModals = () => {
		showLoginModal = false;
		showSignupModal = false;
	};
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
	<!-- Navigation -->
	<nav class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex items-center">
					<span class="text-xl font-bold text-blue-600">Wallet App</span>
				</div>
				<div class="flex items-center space-x-4">
					<button
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
						on:click={() => (showLoginModal = true)}
					>
						Sign In
					</button>
					<button
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
						on:click={() => (showSignupModal = true)}
					>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="text-center" in:fade={{ duration: 1000, delay: 200 }}>
			<h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
				<span class="block">Welcome to</span>
				<span class="block text-blue-600">Wallet App, Platform</span>
			</h1>
			<p
				class="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
			>
				Experience the best platform for your needs. Sign up now and join thousands of satisfied
				users.
			</p>
			<div class="mx-auto mt-5 flex max-w-md justify-center space-x-4">
				<button
					class="rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
					on:click={() => (showSignupModal = true)}
				>
					Get Started
				</button>
				<button
					class="rounded-md border border-blue-600 bg-white px-8 py-3 text-base font-medium text-blue-600 transition-colors hover:bg-gray-50"
					on:click={() => (showLoginModal = true)}
				>
					Learn More
				</button>
			</div>
		</div>
	</main>

	<Modal isOpen={showLoginModal} onClose={closeModals}>
		<AuthForm
			type="login"
			onClose={closeModals}
			form={$loginForm}
			errors={$loginErrors}
			message={$loginMessage}
			enhance={loginEnhance}
			submitting={$loginSubmitting}
		/>
	</Modal>

	<Modal isOpen={showSignupModal} onClose={closeModals}>
		<AuthForm
			type="signup"
			onClose={closeModals}
			form={$signupForm}
			errors={$signupErrors}
			message={$signupMessage}
			enhance={signupEnhance}
			submitting={$signupSubmitting}
		/>
	</Modal>
</div>
