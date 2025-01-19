<script lang="ts">
	export let name: string;
	export let confirmDelete: () => void;
	export let canselDelete: () => void;
</script>

<div>
	<p>
		Are you sure you want to delete {name}
	</p>
	<button on:click={confirmDelete}>Delete</button>
	<button on:click={canselDelete}>Cancel</button>
</div>
