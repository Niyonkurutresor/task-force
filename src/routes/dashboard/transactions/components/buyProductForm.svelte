<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { CircleSlash } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	export let closeModals: () => void;
	interface Product {
		budget_list_id: string;
		amount: number;
		quantity: number;
		product_name: string;
	}
	interface SubCategoryId {
		subcagory_id: string;
	}
	interface Amounts {
		[key: string]: number;
	}
	let products: Product[] = [];
	let amounts: Amounts = {};
	async function buyProduct(subcategory_id: string, amount: number) {
		try {
			// const response = await fetch(`${PUBLIC_API_URL ?? ''}/budget/`, {
			// 	method: 'POST',
			// 	body: JSON.stringify(newBudget)
			// });
			// const budget = await response.json();
			// if (budget?.message) {
			// 	newBudget = { name: '', descrition: '', start_date: '', end_date: '' };
			// 	closeModals();
			// 	return toast.success(budget?.message ?? 'Product Category added successfully.');
			// }
			// toast.error(budget?.error ?? 'Something went wrong');
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}

	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/bugetListById/`);
			const productsResult = await response.json();
			if (productsResult?.message) {
				products = productsResult?.message ?? [];
				return;
			}
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	});
</script>

<section class="rounded-lg bg-white p-6 shadow">
	<h2 class="mb-4 text-2xl font-semibold">Buy Product</h2>
	<div class="mb-4">
		<div class="overflow-x-auto">
			<table class="min-w-full rounded-lg border border-gray-200 bg-white shadow-sm">
				<thead>
					<tr class="bg-gray-50">
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Product Name</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Amount</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Quantity</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Action</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#if products?.length > 0}
						{#each products as product}
							<tr class="hover:bg-gray-50">
								<td class="whitespace-nowrap px-6 py-4">{product?.product_name ?? ''}</td>
								<td class="whitespace-nowrap px-6 py-4">{product?.amount ?? ''}</td>
								<td class="whitespace-nowrap px-6 py-4">{product?.quantity ?? ''}</td>
								<td class="whitespace-nowrap px-6 py-4">
									<form
										on:submit|preventDefault={() =>
											buyProduct(product.budget_list_id, amounts[product.budget_list_id])}
										class="flex items-center gap-2"
									>
										<input
											type="number"
											bind:value={amounts[product.budget_list_id]}
											placeholder="Enter amount"
											class="rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
											min="0"
											required
										/>
										<button
											type="submit"
											class="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
										>
											Buy
										</button>
									</form>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="3" class="h-[4rem] w-full bg-gray-100 text-center text-gray-400">
								<div class="flex items-center justify-center gap-8">
									<CircleSlash size="40" /> <span>There is no product list</span>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</section>
