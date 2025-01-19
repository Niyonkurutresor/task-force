<script lang="ts">
	export let name: string;
	export let confirmDelete: () => void;
	export let canselDelete: () => void;
</script>

<div class="">
	<p class=" mb-7 text-2xl">
		Are you sure you want to delete {name}
	</p>
	<div class=" flex items-center justify-start gap-4">
		<button
			class="flex items-center gap-2 rounded-md bg-red-400 px-3 py-2 text-sm font-medium text-white backdrop:to-blue-400 hover:text-gray-100"
			on:click={confirmDelete}>Delete</button
		>
		<button
			class="flex items-center gap-2 rounded-md bg-blue-400 px-3 py-2 text-sm font-medium text-white backdrop:to-blue-400 hover:text-gray-100"
			on:click={canselDelete}>Cancel</button
		>
	</div>
</div>
