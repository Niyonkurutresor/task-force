<script lang="ts">
	import { CircleSlash } from 'lucide-svelte';
	import BudgetProductForm from './BudgetProductForm.svelte';
	import Modal from './Modal.svelte';
	import toast from 'svelte-french-toast';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { afterUpdate, onMount } from 'svelte';
	export let budget_id: string;
	let isLoading = false;

	interface Transaction {
		id: string;
		description: string;
		date: string;
		amount: number;
		type: 'income' | 'expense';
		category: string;
		status: 'completed' | 'pending' | 'failed';
	}

	interface Products {
		sub_category_id: string;
		budget_id: string;
		quanity: number;
		amount: number;
		isBought: boolean;
	}

	interface SubCategory {
		sub_category_id: string;
		sub_category_name: string;
	}

	interface Budget {
		budget_id: string;
		budget_name: string;
	}

	let products: Products[] = [];
	let subCategories: SubCategory[] = [];
	let newProduct = { sub_category_id: '', budget_id: '', quantity: 0, amount: 0 };
	onMount(async () => {
		isLoading = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/bugetListById/${budget_id}`);
			const subCategoriesREsponse = await fetch(`${PUBLIC_API_URL}/subCategory`);
			products = (await response.json())?.message ?? [];
			subCategories = (await subCategoriesREsponse.json())?.message ?? [];
			isLoading = false;
		} catch (error) {
			toast.error('Try to reload');
			console.error('Error fetching settings data:', error);
			isLoading = false;
		}
	});

	afterUpdate(async () => {
		const response = await fetch(`${PUBLIC_API_URL}/bugetListById/${budget_id}`);
		products = (await response.json())?.message ?? [];
	});

	async function addProduct() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/budgetList/`, {
				method: 'POST',
				body: JSON.stringify({ ...newProduct, budget_id: budget_id ?? '' })
			});
			const addResponse = await response.json();
			if (addResponse?.message) {
				toast.success(addResponse?.message ?? '');
			} else {
				toast.error(addResponse?.error ?? '');
			}
			newProduct = { sub_category_id: '', budget_id: '', quantity: 0, amount: 0 };
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}
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

	let addproductModel = false;
	const closeModals = () => {
		addproductModel = false;
	};
</script>

<div class="space-y-4">
	<section class="mb-8 rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-semibold">Product</h2>
		<div class="mb-4">
			<h3 class="mb-2 text-xl">Add New Product</h3>
			<form on:submit|preventDefault={addProduct} class="flex space-x-4">
				<select bind:value={newProduct.sub_category_id} name="category_id" id="category_id">
					<option value="" disabled> Select Product</option>
					{#each subCategories as subCategory}
						<option value={subCategory.sub_category_id}
							>{subCategory?.sub_category_name ?? ''}</option
						>
					{/each}
				</select>
				<input
					type="number"
					placeholder="Quantity"
					bind:value={newProduct.quantity}
					class="flex-1 rounded border p-2"
					required
				/>
				<input
					type="number"
					placeholder="Total amount"
					bind:value={newProduct.amount}
					class="flex-1 rounded border p-2"
				/>
				<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
					Add Product
				</button>
			</form>
		</div>
	</section>
	<div class="rounded-lg border border-gray-200 bg-white">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Name
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
							</tr>
						{/each}
					{:else if products?.length > 0}
						{#each products as product}
							<tr class="hover:bg-gray-50">
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-900">
										{subCategories.map((sub_category) =>
											sub_category.sub_category_id == product.sub_category_id
												? sub_category.sub_category_name
												: ''
										)[0]}
									</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-500">
										{product?.quanity ?? ''}
									</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm text-gray-500">{product?.amount}</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="text-sm {!product?.isBought ? 'text-green-600' : 'text-red-600'}">
										{product?.isBought === true ? 'Bought' : 'Availabel'}
									</div>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="3" class="h-[4rem] w-full bg-gray-100 text-center text-gray-400">
								<div class=" flex items-center justify-center gap-8">
									<CircleSlash size="40" /> <span>There is no product list</span>
								</div>
							</td>
						</tr>
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
	<Modal isOpen={addproductModel} onClose={closeModals}>
		<BudgetProductForm {closeModals} />
	</Modal>
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
