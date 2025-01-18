<script>
	let budget = {
		name: '',
		start_date: '',
		end_date: '',
		description: ''
	};
</script>

<div class="w-full max-w-md">
	<form class="space-y-4">
		<div>
			<label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
			<input
				id="name"
				type="text"
				bind:value={budget.name}
				required
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>

		<div>
			<label for="start_date" class="block text-sm font-medium text-gray-700">Start Date:</label>
			<input
				id="start_date"
				type="date"
				bind:value={budget.start_date}
				required
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>

		<div>
			<label for="end_date" class="block text-sm font-medium text-gray-700">End Date:</label>
			<input
				id="end_date"
				type="date"
				bind:value={budget.end_date}
				required
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>

		<div>
			<label for="description" class="block text-sm font-medium text-gray-700">Description:</label>
			<textarea
				id="description"
				rows="4"
				bind:value={budget.description}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			></textarea>
		</div>

		<button
			type="submit"
			class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			Add Budget
		</button>
	</form>
</div>
