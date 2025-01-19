<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import toast from 'svelte-french-toast';
	export let closeModals: () => void;
	interface Products {
		sub_category_id: string;
		budget_id: string;
		quanity: number;
		amount: number;
		isBought: boolean;
	}

	interface MethodOFPayment {
		payment_method_id: string;
		method_name: string;
	}

	let isLoading = false;
	let paymentMethods: MethodOFPayment[] = [];
	let newIncome = { payment_method_id: '', income: 0 };
	onMount(async () => {
		isLoading = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/methodOfPayment/`);
			const paymentMethotsREsponse = (await response.json())?.message ?? [];
			if (paymentMethotsREsponse) {
				paymentMethods = paymentMethotsREsponse;
			} else {
				toast.error(paymentMethotsREsponse ?? 'Something Went wrong, Please try again.');
			}
			isLoading = false;
		} catch (error) {
			toast.error('Try to reload');
			console.error('Error fetching settings data:', error);
			isLoading = false;
		}
	});
	async function addProduct() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/addMoney/`, {
				method: 'POST',
				body: JSON.stringify({ ...newIncome, budget_id: newIncome.payment_method_id ?? '' })
			});
			const addResponse = await response.json();
			if (addResponse?.message) {
				toast.success(addResponse?.message ?? '');
				closeModals();
			} else {
				toast.error(addResponse?.error ?? '');
			}
			newIncome = { payment_method_id: '', income: 0 };
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}
</script>

{#if !isLoading}
	<div>
		<h2 class="mb-4 text-2xl font-semibold">Desposit</h2>
		<div class="mb-4">
			<form on:submit|preventDefault={addProduct} class="flex space-x-4">
				<select bind:value={newIncome.payment_method_id} name="category_id" id="category_id">
					<option value="" disabled> Resource</option>
					{#each paymentMethods as method}
						<option value={method.payment_method_id}>{method?.method_name ?? ''}</option>
					{/each}
				</select>
				<input
					type="number"
					placeholder="Amount"
					bind:value={newIncome.income}
					class="flex-1 rounded border p-2"
					required
				/>

				<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white"> Deposit </button>
			</form>
		</div>
	</div>
{/if}
