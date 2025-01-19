<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import BudgetTable from '$lib/components/BugdetTable.svelte';
	import { SquarePlus } from 'lucide-svelte';
	import { ChevronRightIcon, CalendarIcon, TargetIcon } from 'svelte-feather-icons';
	import BudgetProductForm from '$lib/components/BudgetProductForm.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import toast from 'svelte-french-toast';
	import { date } from 'drizzle-orm/mysql-core';
	import { afterUpdate, onMount } from 'svelte';
	import formatDate from '$lib/helper/formdata';

	interface Business {
		name: string;
		location: string;
	}

	type Budget = {
		name: string;
		budget_name?: string;
		budget_id?: string;
		descrition: string;
		start_date: Date;
		end_date: Date;
	};
	let budgets: Budget[] = [];
	let Loading = false;
	onMount(async () => {
		Loading = true;
		try {
			const bgt = await fetch(`${PUBLIC_API_URL}/budget`);
			budgets = (await bgt.json())?.message ?? [];
			Loading = false;
		} catch (error) {
			toast.error('Try to reload');
			console.error('Error fetching settings data:', error);
			Loading = false;
		}
	});

	// afterUpdate(async () => {
	// 	const bgt = await fetch(`${PUBLIC_API_URL}/budget`);
	// 	budgets = (await bgt.json())?.message ?? [];
	// });
	let budgetModel = false;
	let addBudgetModel = false;
	let selectedId = '';

	const closeModals = () => {
		budgetModel = false;
		addBudgetModel = false;
	};
	let newBudget = { name: '', descrition: '', start_date: '', end_date: '' };
</script>

{#if !Loading}
	<div>
		<button
			class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 backdrop:to-blue-400 hover:text-gray-900"
			on:click={() => (addBudgetModel = true)}
		>
			<SquarePlus />
			<span>Budget</span>
		</button>
		<div class="grid cursor-pointer grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
			{#each budgets as budget}
				<div
					class="flex cursor-pointer items-center rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
					on:click={() => {
						(budgetModel = true), (selectedId = budget?.budget_id ?? '');
					}}
				>
					<div class="flex-1">
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
								<TargetIcon size="25" class=" text-blue-700 " />
							</div>
							<h2 class="font-medium text-gray-900">{budget?.budget_name ?? ''}</h2>
						</div>
						<div class=" flex items-end justify-between">
							<div class="mt-2 flex items-center gap-2 text-gray-600">
								<CalendarIcon size="10" />
								<span class="text-sm">{formatDate(budget?.start_date ?? '')}</span>
							</div>
							<div class="mt-2 flex items-center gap-2 text-gray-600">
								<CalendarIcon size="10" />
								<span class="text-sm">{formatDate(budget?.end_date ?? '')}</span>
							</div>
						</div>
					</div>
					<div class="ml-4">
						<ChevronRightIcon />
					</div>
				</div>
			{/each}
		</div>
		<Modal isOpen={addBudgetModel} onClose={closeModals}>
			<BudgetProductForm {closeModals} />
		</Modal>
		<Modal isOpen={budgetModel} onClose={closeModals}>
			<BudgetTable budget_id={selectedId} />
		</Modal>
	</div>
{/if}
