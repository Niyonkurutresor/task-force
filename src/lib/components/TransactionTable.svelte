<script lang="ts">
	import { SearchIcon, FilterIcon } from 'svelte-feather-icons';

	let isLoading = true;

	interface Transaction {
		id: string;
		description: string;
		date: string;
		amount: number;
		type: 'income' | 'expense';
		category: string;
		status: 'completed' | 'pending' | 'failed';
	}

	const transactions: Transaction[] = [
		{
			id: '1',
			description: 'Grocery Shopping',
			date: '2024-01-18',
			amount: 120.5,
			type: 'expense',
			category: 'Food',
			status: 'completed'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};
</script>

<div class="space-y-4">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex gap-3">
			<div class="relative">
				<SearchIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Search transactions..."
					class="rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			<button
				class="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
			>
				<FilterIcon class="h-4 w-4" />
				<span>Filter</span>
			</button>
		</div>
	</div>

	<div class="rounded-lg border border-gray-200 bg-white">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Description
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Date
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Category
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Amount
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Status
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
									<div class="text-sm text-gray-900">{transaction.description}</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-500">
										{new Date(transaction.date).toLocaleDateString()}
									</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-500">{transaction.category}</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div
										class="text-sm {transaction.type === 'income'
											? 'text-green-600'
											: 'text-red-600'}"
									>
										{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
									</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span
										class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 {getStatusColor(
											transaction.status
										)}"
									>
										{transaction.status}
									</span>
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
