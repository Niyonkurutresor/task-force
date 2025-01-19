<script lang="ts">
	import { Trash2, Edit, ChevronDown, ChevronRight } from 'lucide-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import DeleteContent from './components/delteContent.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import toast from 'svelte-french-toast';
	type Category = {
		category_id: string;
		category_name: string;
		category_description: string;
		created_at: string;
	};

	type SubCategory = {
		sub_category_id: string;
		category_id: string;
		sub_category_name: string;
		sub_category_description: string;
		created_at: string;
	};

	export let categories: Category[] = [];
	export let subCategories: SubCategory[] = [];

	onMount(async () => {
		try {
			const allCategories = await fetch(`${PUBLIC_API_URL}/category`);
			const subCategorie = await fetch(`${PUBLIC_API_URL}/subCategory`);

			categories = (await allCategories.json())?.message ?? [];
			subCategories = (await subCategorie.json())?.message ?? [];
		} catch (error) {
			console.error('Error fetching settings data:', error);
		}
	});

	let expandedCategories = new Set<string>();
	let openEditModle = false;
	let openDeleteModle = false;
	let selectedId = '';
	let selectedtype: 'CATEGORY' | 'SUBCATEGORY' = 'CATEGORY';

	const closeModals = () => {
		openEditModle = false;
		openDeleteModle = false;
	};

	function toggleCategory(categoryId: string) {
		if (expandedCategories.has(categoryId)) {
			expandedCategories.delete(categoryId);
		} else {
			expandedCategories.add(categoryId);
		}
		expandedCategories = expandedCategories;
	}

	function getSubcategoriesForCategory(categoryId: string) {
		return subCategories.filter((sub) => sub.category_id === categoryId);
	}

	async function handleDeleteCategory(categoryId: string) {
		const deletedCategory = await fetch(`${PUBLIC_API_URL}/category/${categoryId}`, {
			method: 'DELETE',
			body: JSON.stringify({})
		});
		const response = await deletedCategory.json();
		if (response?.message) {
			toast.success(response?.message ?? '');
			openDeleteModle = false;
		} else {
			toast.error(response?.error ?? '');
		}
	}

	function handleDeleteSubcategory(subCategoryId: string) {
		if (confirm('Are you sure you want to delete this subcategory?')) {
			console.log('Delete subcategory:', subCategoryId);
		}
	}

	// Handle category edit
	function handleEditCategory(category: Category) {
		// Emit edit event or handle edit logic
		console.log('Edit category:', category);
	}

	// Handle subcategory edit
	function handleEditSubcategory(subCategory: SubCategory) {
		// Emit edit event or handle edit logic
		console.log('Edit subcategory:', subCategory);
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full bg-white">
		<thead>
			<tr class="bg-gray-100">
				<th class="px-4 py-2 text-left">Expand</th>
				<th class="px-4 py-2 text-left">Name</th>
				<th class="px-4 py-2 text-left">Description</th>
				<th class="px-4 py-2 text-left">Created At</th>
				<th class="px-4 py-2 text-center">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each categories as category}
				<!-- category -->
				<tr class="border-b hover:bg-gray-50">
					<td class="px-4 py-2">
						<button
							class="rounded p-1 hover:bg-gray-200"
							on:click={() => toggleCategory(category.category_id)}
						>
							{#if expandedCategories.has(category.category_id)}
								<ChevronDown size={20} />
							{:else}
								<ChevronRight size={20} />
							{/if}
						</button>
					</td>
					<td class="px-4 py-2 font-medium">{category.category_name}</td>
					<td class="px-4 py-2">{category.category_description}</td>
					<td class="px-4 py-2">{new Date(category.created_at).toLocaleDateString()}</td>
					<td class="px-4 py-2">
						<div class="flex justify-center space-x-2">
							<button
								class="rounded p-1 text-blue-600 hover:bg-blue-100"
								on:click={() => handleEditCategory(category)}
							>
								<Edit size={18} />
							</button>
							<button
								class="rounded p-1 text-red-600 hover:bg-red-100"
								on:click={() => {
									openDeleteModle = true;
									selectedId = category?.category_id ?? '';
									selectedtype = 'CATEGORY';
								}}
							>
								<Trash2 size={18} />
							</button>
						</div>
					</td>
				</tr>

				<!-- subcategory -->
				{#if expandedCategories.has(category.category_id)}
					{#each getSubcategoriesForCategory(category.category_id) as subCategory}
						<tr class="border-b bg-gray-50">
							<td class="px-4 py-2"></td>
							<td class="px-4 py-2 pl-8">{subCategory.sub_category_name}</td>
							<td class="px-4 py-2">{subCategory.sub_category_description}</td>
							<td class="px-4 py-2">{new Date(subCategory.created_at).toLocaleDateString()}</td>
							<td class="px-4 py-2">
								<div class="flex justify-center space-x-2">
									<button
										class="rounded p-1 text-blue-600 hover:bg-blue-100"
										on:click={() => handleEditSubcategory(subCategory)}
									>
										<Edit size={18} />
									</button>
									<button
										class="rounded p-1 text-red-600 hover:bg-red-100"
										on:click={() => handleDeleteSubcategory(subCategory.sub_category_id)}
									>
										<Trash2 size={18} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			{/each}
		</tbody>
	</table>

	<!-- <Modal isOpen={openEditModle} onClose={closeModals}>
	</Modal> -->
	{#if selectedtype === 'CATEGORY'}
		<Modal isOpen={openDeleteModle} onClose={closeModals}>
			<DeleteContent
				name={'soemthing'}
				canselDelete={closeModals}
				confirmDelete={() => handleDeleteCategory(selectedId)}
			/>
		</Modal>
	{/if}
</div>
