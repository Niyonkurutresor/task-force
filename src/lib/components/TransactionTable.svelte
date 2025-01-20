<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { SearchIcon, FilterIcon } from 'svelte-feather-icons';
	export let id;
	let isLoading = false;

	interface Transaction {
		transaction_id: string;
		income: number | null;
		expanse: number | null;
		balance: number | null;
		payment_method: string | null;
		date: Date | null;
	}

	let transactions: Transaction[] = [];
	let allTransactions: Transaction[] = [];
	let search = '';

	onMount(async () => {
		try {
			isLoading = true;
			const allCategories = await fetch(`${PUBLIC_API_URL}/transaction`);
			allTransactions = (await allCategories.json())?.message ?? [];
			transactions = allTransactions;
			isLoading = false;
		} catch (error) {
			console.error('Error fetching settings data:', error);
			isLoading = false;
		}
	});

	$: if (search) {
		transactions = allTransactions.filter(
			(transaction) =>
				transaction.payment_method?.toLowerCase().includes(search.toLowerCase()) ||
				transaction.income?.toString().includes(search) ||
				transaction.expanse?.toString().includes(search) ||
				transaction.balance?.toString().includes(search) ||
				transaction.date?.toString().includes(search)
		);
	} else {
		transactions = allTransactions;
	}
</script>

<div class="space-y-4">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex gap-3">
			<div class="relative">
				<SearchIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					bind:value={search}
					placeholder="Search transactions..."
					class="rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				/>
			</div>
			<!-- 
			<button
				class="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
			>
				<FilterIcon class="h-4 w-4" />
				<span>Filter</span>
			</button> -->
		</div>
	</div>

	<div class="rounded-lg border border-gray-200 bg-white" {id}>
		<div class="overflow-x-auto">
			<h1 class=" my-[1rem] ml-[2rem] text-xl text-gray-500">Transaction summary</h1>
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Method Name
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Income
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Expense
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Balance
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Date
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#if isLoading}
						{#each Array(5) as _}
							<tr class="animate-pulse">
								<td class="whitespace-nowrap px-6 py-4">
									<div class="h-4 w-3/4 rounded bg-gray-200"></div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="h-4 w-24 rounded bg-gray-200"></div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="h-4 w-20 rounded bg-gray-200"></div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="h-4 w-16 rounded bg-gray-200"></div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="h-4 w-20 rounded bg-gray-200"></div>
								</td>
							</tr>
						{/each}
					{:else}
						{#each transactions as transaction}
							<tr class="hover:bg-gray-50">
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-900">{transaction.payment_method}</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-500">
										{transaction?.income ?? 0}
									</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-500">{transaction?.expanse ?? 0}</div>
								</td>

								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-500">{transaction?.balance ?? 0}</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-500">
										{new Date(transaction?.date ?? '').toLocaleDateString()}
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<div
		class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
	>
		<div class="flex flex-1 justify-between sm:hidden">
			<button
				class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Previous
			</button>
			<button
				class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Next
			</button>
		</div>
		<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
			<div>
				<p class="text-sm text-gray-700">
					Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of{' '}
					<span class="font-medium">20</span> results
				</p>
			</div>
			<div>
				<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
					<button
						class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						Previous
					</button>
					<button
						class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						1
					</button>
					<button
						class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						2
					</button>
					<button
						class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						Next
					</button>
				</nav>
			</div>
		</div>
	</div>
</div>

<style>
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
