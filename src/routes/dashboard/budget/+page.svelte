<script>
	let budget = {
		name: '',
		start_date: '',
		end_date: '',
		description: ''
	};

	const handleSubmit = () => {
		console.log('Budget submitted:', budget);
	};

	const addCategory = () => {
		console.log('Add Category button clicked');
	};

	const addSubCategory = () => {
		console.log('Add Subcategory button clicked');
	};
</script>

<div class="flex items-start justify-between gap-8">
	<!-- Form Section -->

	<!-- Buttons Section -->
	<div class="flex flex-col gap-4">
		<button
			on:click={addCategory}
			class="rounded-md bg-green-500 px-4 py-2 text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
		>
			Add Category
		</button>
		<button
			on:click={addSubCategory}
			class="rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
		>
			Add Subcategory
		</button>
	</div>
</div>
