<script lang="ts">
	import { ActivityIcon, AlertCircle } from 'lucide-svelte';
	import Statistics from './transactions/components/transactionStatistics.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import HomeTransactionLoader from '$lib/components/hometransactionLoader.svelte';

	interface Description {
		title: string;
		description: string;
		amount: string;
		date: Date;
		isIncome: boolean;
	}
	let isLoading = false;
	let transSummary: Description[] = [];
	onMount(async () => {
		isLoading = true;
		try {
			isLoading = true;
			const allCategories = await fetch(`${PUBLIC_API_URL}/recentAction`);
			transSummary = (await allCategories.json())?.message?.transactions ?? [];
			isLoading = false;
		} catch (error) {
			console.error('Error fetching settings data:', error);
			isLoading = false;
		}
	});
</script>

<div class="space-y-6">
	{#if isLoading}{:else}
		<Statistics />
	{/if}

	<!-- charts -->
	<div class="grid grid-cols-1 gap-6 bg-white p-6 shadow-sm md:grid-cols-2"></div>

	<!-- recent Transactions -->
	<div class="rounded-lg bg-white p-6 shadow-sm">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-lg font-medium text-gray-900">Recent Transactions</h2>
			<a href="/dashboard/transactions" class="text-sm text-blue-600 hover:text-blue-800"
				>View all</a
			>
		</div>

		{#if !isLoading}
			<div class="space-y-4">
				{#each transSummary as transaction}
					<div class="flex items-center justify-between border-b border-gray-100 pb-4">
						<div class="flex items-center space-x-3">
							<div class="rounded-full bg-gray-100 p-2">
								<ActivityIcon class="h-5 w-5 text-gray-600" />
							</div>
							<div>
								<p class="font-medium text-gray-900">{transaction.title}</p>
								<p class="text-sm text-gray-500">
									{new Date(transaction.date).toLocaleDateString()}
								</p>
							</div>
						</div>
						<span class={transaction?.isIncome ? 'text-green-600' : 'text-red-600'}>
							{transaction.amount}
						</span>
					</div>
				{/each}
			</div>
		{:else}
			<HomeTransactionLoader />
		{/if}
	</div>
	<div class="border-yellow-200 bg-yellow-50">
		<div class="flex items-center p-6">
			<AlertCircle class="mr-2 h-5 w-5 text-yellow-500" />
			<p class="text-yellow-700">
				You've reached 85% of your monthly budget in the "Entertainment" category.
			</p>
		</div>
	</div>
</div>
