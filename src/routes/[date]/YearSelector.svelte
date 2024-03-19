<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{ update: { year: number } }>();

	export let year: number;
	export let classes: string = '';

	const nextYear = () => {
		year += 1;
		dispatch('update', { year: year });
	};
	const prevYear = () => {
		year -= 1;
		dispatch('update', { year: year });
	};
</script>

<div id="yearSelector" class={classes}>
	<button on:click={prevYear} class="arrow-btn">
		<svg viewBox="0 0 20 20" class="arrow-fill" style="transform: rotate(180deg);">
			<polygon points="5,5 15,10 5,15" />
		</svg>
	</button>
	<strong id="year">{year}</strong>
	<button on:click={nextYear} class="arrow-btn">
		<svg viewBox="0 0 20 20" class="arrow-fill">
			<polygon points="5,5 15,10 5,15" />
		</svg>
	</button>
</div>

<style lang="scss">
	@use '$lib/color';

	#yearSelector {
		display: flex;
		align-items: center;
	}

	#year {
		font-size: 1.5rem;
		color: hsl(color.$main-hue, color.$main-saturation, 25%);
	}

	.arrow-btn {
		width: 1.5rem;
		height: 1.5rem;
	}
	.arrow-fill {
		fill: hsl(color.$main-hue, color.$main-saturation, 25%);
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
