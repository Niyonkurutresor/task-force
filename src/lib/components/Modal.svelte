<script lang="ts">
	import { scale, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let isOpen: boolean;
	export let onClose: () => void;

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') onClose();
	};
</script>

<svelte:window on:keydown={handleEscape} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		on:click={onClose}
		transition:fade={{ duration: 200 }}
	>
		<div
			class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
			on:click|stopPropagation
			transition:scale={{
				duration: 300,
				easing: quintOut,
				start: 0.95
			}}
		>
			<slot />
		</div>
	</div>
{/if}
