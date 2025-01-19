<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import tippy from 'svelte-tippy';
	import toast from 'svelte-french-toast';
	import { roundArrow } from 'tippy.js';
	import 'tippy.js/animations/perspective-subtle.css';
	import { PUBLIC_API_URL } from '$env/static/public';
	// Types based on your schema
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
			const allCategories = await fetch(`${PUBLIC_API_URL}/category`);
			categories = (await allCategories.json())?.message ?? [];
		} catch (error) {
			console.error('Error fetching settings data:', error);
		}
	});

	// afterUpdate(async () => {
	// 	const allCategories = await fetch(`${PUBLIC_API_URL}/category`);
	// 	categories = (await allCategories.json())?.message ?? [];
	// });

	async function updateProfile() {
		if (newPassword !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		try {
			await fetch(`${PUBLIC_API_URL ?? ''}/user/profile`, {
				method: 'PUT',
				body: JSON.stringify({
					name: newName,
					currentPassword,
					newPassword
				})
			});
			isEditingProfile = false;
			user = { ...user, name: newName } as User;
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	}

	async function addCategory() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/category/`, {
				method: 'POST',
				body: JSON.stringify(newCategory)
			});
			const category = await response.json();
			categories = [...categories, category];
			newCategory = { name: '', description: '' };
			toast.success('Category added successfully.');
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}

	async function addSubCategory() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/subCategory/`, {
				method: 'POST',
				body: JSON.stringify(newSubCategory)
			});
			await response.json();
			newSubCategory = { name: '', category_id: '', descrition: '' };
			toast.success('Sub category added successfully.');
		} catch (error) {
			toast.error('Something went wrong, Please try again.');
			console.error('Error adding category:', error);
		}
	}

	async function addPaymentMethod() {
		try {
			const response = await fetch(`${PUBLIC_API_URL ?? ''}/methodOfPayment/`, {
				method: 'POST',
				body: JSON.stringify(newPaymentMethod)
			});
			const method = await response.json();

			paymentMethods = [...paymentMethods, method];
			newPaymentMethod = { name: '' };
			toast.success('Payment method addedd successfully.');
		} catch (error) {
			toast.error('Something went wrong');
			console.error('Error adding payment method:', error);
		}
	}

	async function deleteCategory(id: string) {
		try {
			await fetch(`/api/categories/${id}`, { method: 'DELETE' });
			categories = categories.filter((cat) => cat.category_id !== id);
		} catch (error) {
			console.error('Error deleting category:', error);
		}
	}

	async function deletePaymentMethod(id: string) {
		try {
			await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' });
			paymentMethods = paymentMethods.filter((method) => method.payment_method_id !== id);
		} catch (error) {
			console.error('Error deleting payment method:', error);
		}
	}
</script>

<div class="container mx-auto p-6">
	<h1
		class="mb-8 w-fit text-3xl font-bold"
		use:tippy={{
			content: 'Hoverd cotente',
			placement: 'top',
			arrow: roundArrow,
			theme: 'light',
			animation: 'perspective-subtle'
		}}
	>
		Settings
	</h1>

	<!-- pprofile Section -->
	<section class="mb-8 rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-semibold">Profile Settings</h2>
		{#if !isEditingProfile}
			<div class="mb-4">
				<p class="mb-2"><strong>Name:</strong> {user?.name}</p>
				<button
					class="rounded bg-blue-500 px-4 py-2 text-white"
					on:click={() => {
						isEditingProfile = true;
						newName = user?.name || '';
					}}
				>
					Edit Profile
				</button>
			</div>
		{:else}
			<form on:submit|preventDefault={updateProfile} class="space-y-4">
				<div>
					<label class="mb-2 block">Name</label>
					<input type="text" bind:value={newName} class="w-full rounded border p-2" required />
				</div>
				<div>
					<label class="mb-2 block">Current Password</label>
					<input
						type="password"
						bind:value={currentPassword}
						class="w-full rounded border p-2"
						required
					/>
				</div>
				<div>
					<label class="mb-2 block">New Password</label>
					<input type="password" bind:value={newPassword} class="w-full rounded border p-2" />
				</div>
				<div>
					<label class="mb-2 block">Confirm New Password</label>
					<input type="password" bind:value={confirmPassword} class="w-full rounded border p-2" />
				</div>
				<div class="flex space-x-4">
					<button type="submit" class="rounded bg-green-500 px-4 py-2 text-white">
						Save Changes
					</button>
					<button
						type="button"
						class="rounded bg-gray-500 px-4 py-2 text-white"
						on:click={() => {
							isEditingProfile = false;
						}}
					>
						Cancel
					</button>
				</div>
			</form>
		{/if}
	</section>

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
				<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
					Add Category
				</button>
			</form>
		</div>
	</section>

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
					Add Sub-category
				</button>
			</form>
		</div>
	</section>

	<section class="rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-semibold">Payment Methods</h2>
		<div class="mb-4">
			<h3 class="mb-2 text-xl">Add New Payment Method</h3>
			<form on:submit|preventDefault={addPaymentMethod} class="flex space-x-4">
				<input
					type="text"
					placeholder="Method Name"
					bind:value={newPaymentMethod.name}
					class="flex-1 rounded border p-2"
					required
				/>
				<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white"> Add Method </button>
			</form>
		</div>
	</section>
</div>
