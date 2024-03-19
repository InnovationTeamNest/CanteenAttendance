<script lang="ts">
	export let month: number;

	const monthAbrevs = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'July',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
</script>

<div id="monthSelector">
	{#each monthAbrevs as mon, i}
		{#if month == i}
			<button><strong style="font-size: 1.5rem">{mon}</strong></button>
		{:else}
			<button
				on:click={() => {
					month = i;
				}}>{mon}</button
			>
		{/if}
	{/each}
</div>

<style lang="scss">
	#monthSelector {
		width: 100%;
		font-size: 1.25rem;
		display: flex;
		justify-content: space-evenly;
		align-items: baseline;
	}

	button,
	input[type='submit'],
	input[type='reset'] {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
