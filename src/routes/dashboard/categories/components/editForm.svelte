<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import HomeTransactionLoader from '$lib/components/hometransactionLoader.svelte';
	export let selectedType: string = 'SUBCATEGORY';
	export let selectedId = '';
	export let canselDelete: () => void;

	type User = {
		user_id: string;
		name: string;
		created_at: string;
	};

	type Category = {
		category_id: string;
		category_name: string;
		category_description: string;
	};
	type SubCategories = {
		category_id: string;
		category_name: string;
		category_description: string;
	};

	type PaymentMethod = {
		payment_method_id: string;
		method_name: string;
	};

	let isloading = false;
	let user: User | null = null;
	let categories: Category[] = [];
	let subCategories: SubCategories[] = [];
	let t = '';
	let newCategory = { name: '', description: '' };
	let newSubCategory = { name: '', category_id: '', descrition: '' };
	let newPaymentMethod = { name: '' };

	onMount(async () => {
		isloading = true;
		try {
			const allCategories = await fetch(`${PUBLIC_API_URL}/category/${selectedId}`);
			const allSubCategories = await fetch(`${PUBLIC_API_URL}/subCategory/${selectedId}`);
			categories = (await allCategories.json())?.message ?? [];
			subCategories = (await allSubCategories.json())?.message ?? [];
			t = selectedType;
		} catch (error) {
			console.error('Error fetching settings data:', error);
		}
		isloading = false;
	});

	async function addCategory() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/category/`, {
				method: 'PATCH',
				body: JSON.stringify(newCategory)
			});
			const category = await response.json();
			categories = [...categories, category];
			newCategory = { name: '', description: '' };
			toast.success('Category updated successfully.');
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}

	async function addSubCategory() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/subCategory/${selectedId}`, {
				method: 'PATCH',
				body: JSON.stringify(newSubCategory)
			});
			await response.json();
			newSubCategory = { name: '', category_id: '', descrition: '' };
			toast.success('Sub category updated successfully.');
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}

	$: t = selectedType;
</script>

{#if t == 'CATEGORY' && isloading === false}
	<section class="mb-8 rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-semibold">Categories {selectedType} {selectedId}</h2>
		<div class="mb-4">
			<h3 class="mb-2 text-xl">Add New Category</h3>
			<form on:submit|preventDefault={addCategory} class="flex space-x-4">
				<input
					type="text"
					placeholder="Category Name"
					bind:value={newCategory.name}
					class="flex-1 rounded border p-2"
					required
				/>
				<input
					type="text"
					placeholder="Description"
					bind:value={newCategory.description}
					class="flex-1 rounded border p-2"
				/>
				<div class="">
					<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
						Update Category
					</button>
					<button
						type="button"
						class="flex items-center gap-2 rounded-md bg-blue-400 px-3 py-2 text-sm font-medium text-white backdrop:to-blue-400 hover:text-gray-100"
						on:click={canselDelete}>Cancel</button
					>
				</div>
			</form>
		</div>
	</section>
{:else if t == 'SUBCATEGORY' && isloading == false}
	<section class="mb-8 rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-semibold">Sub Categories {selectedType} {selectedId}</h2>
		<div class="mb-4">
			<h3 class="mb-2 text-xl">Add New Sub-category</h3>
			<form on:submit|preventDefault={addSubCategory} class="flex flex-col gap-3">
				<input
					type="text"
					placeholder="Sub category Name"
					bind:value={newSubCategory.name}
					class="flex-1 rounded border p-2"
					required
				/>
				<input
					type="text"
					placeholder="Description"
					bind:value={newSubCategory.descrition}
					class="flex-1 rounded border p-2"
				/>

				<select bind:value={newSubCategory.category_id} name="category_id" id="category_id">
					<option value="" disabled> Select Cagetory</option>
					{#each categories as category}
						<option value={category?.category_id}>{category?.category_name ?? ''}</option>
					{/each}
				</select>
				<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
					Update Sub-category
				</button>
			</form>
		</div>
	</section>
{:else}
	<HomeTransactionLoader />
{/if}
