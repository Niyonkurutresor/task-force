<script lang="ts">
	import { DollarSignIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface DashboardStat {
		title: string;
		amount: string;
		change: string;
		isPositive: boolean;
	}

	let transSummary: DashboardStat[] = [];

	onMount(async () => {
		try {
			const allCategories = await fetch(`${PUBLIC_API_URL}/transaction/history`);
			transSummary = (await allCategories.json())?.message ?? [];
		} catch (error) {
			console.error('Error fetching settings data:', error);
		}
	});
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-semibold text-gray-900">Statistics</h1>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each transSummary as stat}
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-medium text-gray-500">{stat.title}</h3>
					<div class="rounded-full bg-blue-100 p-2">
						<DollarSignIcon class="h-5 w-5 text-blue-600" />
					</div>
				</div>
				<p class="mt-2 text-2xl font-semibold text-gray-900">{stat.amount}</p>
				<div class="mt-2 flex items-center text-sm">
					{#if stat.isPositive}
						<TrendingUpIcon class="mr-1 h-4 w-4 text-green-500" />
						<span class="text-green-500">{stat.change}</span>
					{:else}
						<TrendingDownIcon class="mr-1 h-4 w-4 text-red-500" />
						<span class="text-red-500">{stat.change}</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
