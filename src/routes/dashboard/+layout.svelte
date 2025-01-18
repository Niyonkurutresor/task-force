<script lang="ts">
	import { enhance } from '$app/forms';
	import type { LayoutData } from './$types';
	let { data }: { data: LayoutData } = $props();
	import { page } from '$app/stores';
	import {
		SettingsIcon,
		WatchIcon,
		PieChartIcon,
		CalendarIcon,
		SpeakerIcon
	} from 'svelte-feather-icons';
	const navigation = [
		{ name: 'Dashboard', href: '/dashboard', icon: PieChartIcon },
		{ name: 'Transactions', href: '/dashboard/transactions', icon: WatchIcon },
		{ name: 'Budget', href: '/dashboard/budget', icon: CalendarIcon },
		{ name: 'Categories', href: '/dashboard/categories', icon: SpeakerIcon },
		{ name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon }
	];
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Sidebar -->
	<nav class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
		<div class="px-4 py-6">
			<h1 class="text-2xl font-bold text-blue-600">Wallet App</h1>
			<p class=" text-blue-600">{data?.user?.userFirstName ?? ''}</p>
			<div class="mt-8 space-y-1">
				{#each navigation as item}
					<a
						href={item.href}
						class="flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 {$page
							.url.pathname === item.href
							? 'bg-blue-50 text-blue-600'
							: ''}"
					>
						<svelte:component this={item.icon} class="mr-3 h-5 w-5" />
						{item.name}
					</a>
				{/each}
			</div>
			<form
				method="post"
				action="/dashboard?/logout"
				use:enhance
				class="mt-[3rem] flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
			>
				<button> Sign out </button>
			</form>
		</div>
	</nav>

	<main class="ml-64 p-8">
		<slot />
	</main>
</div>
