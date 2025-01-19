<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import toast from 'svelte-french-toast';
	export let closeModals: () => void;
	let newBudget = { name: '', descrition: '', start_date: '', end_date: '' };
	async function addNewBudget() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/budget/`, {
				method: 'POST',
				body: JSON.stringify(newBudget)
			});
			const budget = await response.json();
			if (budget?.message) {
				newBudget = { name: '', descrition: '', start_date: '', end_date: '' };
				closeModals();
				return toast.success(budget?.message ?? 'Product Category added successfully.');
			}
			toast.error(budget?.error ?? 'Something went wrong');
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}
</script>

<section class="rounded-lg bg-white p-6 shadow">
	<h2 class="mb-4 text-2xl font-semibold">Budget</h2>
	<div class="mb-4">
		<h3 class="mb-2 text-xl">Add Budget</h3>
		<form on:submit|preventDefault={addNewBudget} class="flex flex-col gap-3 space-x-4">
			<input
				type="text"
				placeholder="Name ex:(Elevete)"
				bind:value={newBudget.name}
				class="ml-4 flex-1 rounded border p-2"
				required
			/>
			<input
				type="text"
				placeholder="Description"
				bind:value={newBudget.descrition}
				class=" flex-1 rounded border p-2"
				required
			/><input
				type="date"
				placeholder="Start date"
				bind:value={newBudget.start_date}
				class="flex-1 rounded border p-2"
				required
			/><input
				type="date"
				placeholder="End date"
				bind:value={newBudget.end_date}
				class="flex-1 rounded border p-2"
				required
			/>
			<button type="submit" class="w-[9rem] rounded bg-blue-500 px-4 py-2 text-white">
				Create Budget
			</button>
		</form>
	</div>
</section>
