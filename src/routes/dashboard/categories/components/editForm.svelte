<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
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

	type PaymentMethod = {
		payment_method_id: string;
		method_name: string;
	};

	// State management
	let user: User | null = null;
	let categories: Category[] = [];
	let paymentMethods: PaymentMethod[] = [];
	let isEditingProfile = false;
	let newName = '';
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';

	let newCategory = { name: '', description: '' };
	let newSubCategory = { name: '', category_id: '', descrition: '' };
	let newPaymentMethod = { name: '' };

	onMount(async () => {
		try {
			const allCategories = await fetch(`${PUBLIC_API_URL}/category/${selectedId}`);
			categories = (await allCategories.json())?.message ?? [];
		} catch (error) {
			console.error('Error fetching settings data:', error);
		}
	});

	async function addCategory() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/category/`, {
				method: 'PUTCH',
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
				method: 'PUTCH',
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
</script>

{#if (selectedType = 'CATEGORY')}
	<section class="mb-8 rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-semibold">Categories</h2>
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
{/if}
{#if (selectedType = 'SUBCATEGORY')}
	<section class="mb-8 rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-semibold">Sub Categories</h2>
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
{/if}
