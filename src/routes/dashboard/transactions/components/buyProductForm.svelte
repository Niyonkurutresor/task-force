<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { CircleSlash } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import HomeTransactionLoader from '$lib/components/hometransactionLoader.svelte';

	export let closeModals: () => void;
	interface Product {
		budget_list_id: string;
		amount: number;
		quantity: number;
		product_name: string;
	}
	interface MethodOFPayment {
		payment_method_id: string;
		method_name: string;
	}
	interface Amounts {
		[key: string]: number;
	}
	let products: Product[] = [];
	let amounts: Amounts = {};
	let newIncome = { payment_method_id: '', income: 0 };
	let paymentMethods: MethodOFPayment[] = [];
	let isLoading = false;

	onMount(async () => {
		try {
			isLoading = true;
			const k = await fetch(`${PUBLIC_API_URL}/methodOfPayment/`);
			const paymentMethotsREsponse = (await k.json())?.message ?? [];
			if (paymentMethotsREsponse) {
				paymentMethods = paymentMethotsREsponse;
			} else {
				toast.error(paymentMethotsREsponse ?? 'Something Went wrong, Please try again.');
			}

			const response = await fetch(`${PUBLIC_API_URL ?? ''}/bugetListById/`);
			const productsResult = await response.json();
			if (productsResult?.message) {
				products = productsResult?.message ?? [];
				return;
			}
			isLoading = false;
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
			isLoading = false;
		}
		isLoading = false;
	});

	async function buyProduct(subcategory_id: string, amount: number) {
		try {
			console.log(subcategory_id, amount, newIncome.payment_method_id);
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/buyProduct/`, {
				method: 'POST',
				body: JSON.stringify({
					budget_list_id: subcategory_id,
					amount,
					payment_method_id: newIncome.payment_method_id
				})
			});
			const transaction = await response.json();
			if (transaction?.message) {
				closeModals();
				return toast.success(transaction?.message ?? 'Product    Category added successfully.');
			}
			toast.error(transaction?.error ?? 'Something went wrong');
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}
</script>

<section class="rounded-lg bg-white p-6 shadow">
	<h2 class="mb-4 text-2xl font-semibold">Buy Product</h2>
	<div class="mb-4">
		<select bind:value={newIncome.payment_method_id} name="category_id" id="category_id">
			<option value="" disabled> Resource</option>
			{#each paymentMethods as method}
				<option value={method.payment_method_id}>{method?.method_name ?? ''}</option>
			{/each}
		</select>
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
											buyProduct(product?.budget_list_id, amounts[product?.budget_list_id])}
										class="flex items-center gap-2"
									>
										<input
											type="number"
											bind:value={amounts[product?.budget_list_id]}
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
