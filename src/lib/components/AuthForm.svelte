<script lang="ts">
	export let type: 'login' | 'signup' = 'login';
	export let onClose: () => void;
	export let form: any;
	export let errors: any;
	export let enhance: any;
	export let message: string | undefined;
	export let submitting: boolean = false;
</script>

<form method="POST" action="?/{type}" use:enhance class="space-y-4">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-2xl font-bold">
			{type === 'login' ? 'Welcome Back' : 'Create Account'}
		</h2>
		<button
			type="button"
			class="text-gray-500 transition-colors hover:text-gray-700"
			on:click={onClose}
		>
			✕
		</button>
	</div>

	{#if message}
		<div class="rounded-md bg-red-50 p-3 text-sm text-red-500">
			{message}
		</div>
	{/if}

	<div class="space-y-2">
		<label for="username" class="block text-sm font-medium text-gray-700"> Username </label>
		<input
			type="text"
			id="username"
			name="user_name"
			class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
			bind:value={form.username}
			required
		/>
		{#if errors.username}
			<p class="mt-1 text-sm text-red-500">{errors.username}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
		<input
			type="password"
			id="password"
			name="password"
			class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
			bind:value={form.password}
			required
		/>
		{#if errors.password}
			<p class="mt-1 text-sm text-red-500">{errors.password}</p>
		{/if}
	</div>

	<button
		type="submit"
		class="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
	>
		{type === 'login' ? 'Sign In' : 'Sign Up'}
		{#if submitting}
			<span class=" pl-3">.....</span>
		{/if}
	</button>
</form>
