<script lang="ts">
	import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon } from 'svelte-feather-icons';
	import TransactionStatistics from './components/transactionStatistics.svelte';
	import TransactionTable from '$lib/components/TransactionTable.svelte';
	import BuyProductForm from './components/buyProductForm.svelte';
	import { BugPlayIcon, ShoppingBagIcon, SquarePlus } from 'lucide-svelte';
	import Modal from '$lib/components/Modal.svelte';
	interface DashboardStat {
		title: string;
		amount: string;
		change: string;
		isPositive: boolean;
	}

	const stats: DashboardStat[] = [
		{
			title: 'Total Balance',
			amount: '$24,500',
			change: '+14% from last month',
			isPositive: true
		},
		{
			title: 'Total Expenses',
			amount: '$3,260',
			change: '-2% from last month',
			isPositive: false
		},
		{
			title: 'Total Savings',
			amount: '$8,940',
			change: '+8% from last month',
			isPositive: true
		},
		{
			title: 'Budget Status',
			amount: '$12,300',
			change: '75% of monthly budget',
			isPositive: true
		}
	];

	let addTransactionModel = false;
	const closeModals = () => {
		addTransactionModel = false;
	};
</script>

<div class=" flex flex-col gap-8">
	<!-- skdfksdf -->
	<TransactionStatistics {stats} />
	<div>
		<button
			class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 backdrop:to-blue-400 hover:text-gray-900"
			on:click={() => (addTransactionModel = true)}
		>
			<ShoppingBagIcon />
			<span>Buy Product</span>
		</button>
	</div>
	<TransactionTable />
	<Modal isOpen={addTransactionModel} onClose={closeModals}>
		<BuyProductForm {closeModals} />
	</Modal>
</div>
