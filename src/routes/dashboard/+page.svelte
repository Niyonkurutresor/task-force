<script lang="ts">
	import { Wallet, TrendingUp, TrendingDown, AlertCircle, ActivityIcon } from 'lucide-svelte';
	const data = {
		balance: 25000,
		monthlyIncome: 45000,
		monthlyExpense: 32000,
		recentTransactions: [
			{ date: '2024-01', income: 4500, expenses: 3200 },
			{ date: '2024-02', income: 4800, expenses: 3600 },
			{ date: '2024-03', income: 4200, expenses: 3100 }
		],
		expensesByCategory: [
			{ name: 'Housing', value: 35 },
			{ name: 'Food', value: 25 },
			{ name: 'Transport', value: 20 },
			{ name: 'Entertainment', value: 20 }
		]
	};

	type RecentTransaction = {
		title: string;
		date: string;
		amount: string;
		type: 'income' | 'expense';
	};

	const recentTransactions: RecentTransaction[] = [
		{
			title: 'Salary Deposit',
			date: 'Today',
			amount: '+$3,500',
			type: 'income'
		},
		{
			title: 'Grocery Shopping',
			date: 'Yesterday',
			amount: '-$120',
			type: 'expense'
		},
		{
			title: 'Netflix Subscription',
			date: '2 days ago',
			amount: '-$15',
			type: 'expense'
		}
	];
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
</script>

<div class="space-y-6">
	<!-- threee Top Cards -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<div class="rounded-md bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between p-6">
				<div>
					<p class="text-sm font-medium text-gray-500">Total Balance</p>
					<h3 class="mt-1 text-2xl font-bold">${data.balance}</h3>
				</div>
				<Wallet class="h-8 w-8 text-blue-500" />
			</div>
		</div>
		<div class="rounded-md bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between p-6">
				<div>
					<p class="text-sm font-medium text-gray-500">Income</p>
					<h3 class="mt-1 text-2xl font-bold text-green-600">
						+${data.monthlyIncome}
					</h3>
				</div>
				<TrendingUp class="h-8 w-8 text-green-500" />
			</div>
		</div>
		<div class="rounded-md bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between p-6">
				<div>
					<p class="text-sm font-medium text-gray-500">Expenses</p>
					<h3 class="mt-1 text-2xl font-bold text-red-600">
						-${data.monthlyExpense}
					</h3>
				</div>
				<TrendingDown class="h-8 w-8 text-red-500" />
			</div>
		</div>
	</div>

	<!-- Charts -->
	<div class="grid grid-cols-1 gap-6 bg-white p-6 shadow-sm md:grid-cols-2">
		<div>
			<div class="p-6">
				<h3 class="text-lg font-semibold">Income vs Expenses</h3>
				<div class="h-[300px]">chart must be in here</div>
			</div>
		</div>

		<div>
			<div class="p-6">
				<h3 class="text-lg font-semibold">Expense Distribution</h3>
				<div class="h-[300px]">
					<div class="mt-4 grid grid-cols-2 gap-4">
						{#each data.expensesByCategory as item, index}
							<div class="flex items-center">
								<div
									class="mr-2 h-3 w-3 rounded-full"
									style="background-color: {COLORS[index % COLORS.length]}"
								/>
								<span class="text-sm text-gray-600">
									{item.name}: {item.value}%
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Recent Transactions -->
	<div class="rounded-lg bg-white p-6 shadow-sm">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-lg font-medium text-gray-900">Recent Transactions</h2>
			<a href="/dashboard/transactions" class="text-sm text-blue-600 hover:text-blue-800"
				>View all</a
			>
		</div>
		<div class="space-y-4">
			{#each recentTransactions as transaction}
				<div class="flex items-center justify-between border-b border-gray-100 pb-4">
					<div class="flex items-center space-x-3">
						<div class="rounded-full bg-gray-100 p-2">
							<ActivityIcon class="h-5 w-5 text-gray-600" />
						</div>
						<div>
							<p class="font-medium text-gray-900">{transaction.title}</p>
							<p class="text-sm text-gray-500">{transaction.date}</p>
						</div>
					</div>
					<span class={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
						{transaction.amount}
					</span>
				</div>
			{/each}
		</div>
	</div>
	<!-- Budget Alert -->
	<div class="border-yellow-200 bg-yellow-50">
		<div class="flex items-center p-6">
			<AlertCircle class="mr-2 h-5 w-5 text-yellow-500" />
			<p class="text-yellow-700">
				You've reached 85% of your monthly budget in the "Entertainment" category.
			</p>
		</div>
	</div>
</div>
