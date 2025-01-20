<script lang="ts">
	import TransactionStatistics from './components/transactionStatistics.svelte';
	import TransactionTable from '$lib/components/TransactionTable.svelte';
	import BuyProductForm from './components/buyProductForm.svelte';
	import AddMoneyForm from './components/addMOneyForm.svelte';
	import { DownloadCloudIcon, ShoppingBagIcon, SquarePlus, TagIcon } from 'lucide-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Modal from '$lib/components/Modal.svelte';
	import { exportToPDF } from '$lib/helper/exportFile';
	import { onMount } from 'svelte';
	interface DashboardStat {
		title: string;
		amount: string;
		change: string;
		isPositive: boolean;
	}

	let addTransactionModel = false;
	let addMoney = false;
	const closeModals = () => {
		addTransactionModel = false;
		addMoney = false;
	};
</script>

<div class=" flex flex-col gap-8">
	<!-- skdfksdf -->
	<TransactionStatistics />
	<div class=" flex items-center gap-6">
		<button
			class="flex items-center gap-2 rounded-md bg-blue-400 px-3 py-2 text-sm font-medium text-white backdrop:to-blue-400 hover:text-gray-100"
			on:click={() => (addMoney = true)}
		>
			<TagIcon />
			<span>Add income</span>
		</button>
		<button
			class="flex items-center gap-2 rounded-md bg-blue-400 px-3 py-2 text-sm font-medium text-white backdrop:to-blue-400 hover:text-gray-100"
			on:click={() => (addTransactionModel = true)}
		>
			<ShoppingBagIcon />
			<span>Buy Product</span>
		</button>
		<button
			class="flex items-center gap-2 rounded-md bg-blue-400 px-3 py-2 text-sm font-medium text-white backdrop:to-blue-400 hover:text-gray-100"
			on:click={() => exportToPDF('Transaction_table', 'landscape')}
		>
			<DownloadCloudIcon />
			<span>Export Pdf</span>
		</button>
	</div>

	<TransactionTable id={'Transaction_table'} />
	<Modal isOpen={addMoney} onClose={closeModals}>
		<AddMoneyForm {closeModals} />
	</Modal>
	<Modal isOpen={addTransactionModel} onClose={closeModals}>
		<BuyProductForm {closeModals} />
	</Modal>
</div>
