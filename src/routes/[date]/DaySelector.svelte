<script lang="ts">
	import { range } from '$lib/common';

	export let year: number;
	export let month: number;
	export let day: number;

	const today = new Date();

	$: prevMonth = new Date(year, month + 0, 0);
	$: thisMonth = new Date(year, month + 1, 0);
	$: nextMonth = new Date(year, month + 2, 0);
	$: fillerDays = (prevMonth.getUTCDay() + 1) % 7;

	const DAYTOFILL = 7 * 6;
</script>

<div class="daySelector">
	<strong>Mon</strong>
	<strong>Tue</strong>
	<strong>Wed</strong>
	<strong>Thu</strong>
	<strong>Fri</strong>
	<strong>Sat</strong>
	<strong>Sun</strong>
	<!-- Fill day prev month -->
	{#if fillerDays > 0}
		{#each range(prevMonth.getDate() - fillerDays + 1, prevMonth.getDate() + 1) as i}
			<div class="day filler">{i}</div>
		{/each}
	{/if}
	{#each range(1, thisMonth.getUTCDate() + 2) as i}
		<button
			on:click={() => {
				day = i;
			}}
		>
			{#if i == today.getUTCDate() && month == today.getUTCMonth() && year == today.getUTCFullYear()}
				<div class="day today"><strong>{i}</strong></div>
			{:else if i == day}
				<div class="day selected"><strong>{i}</strong></div>
			{:else}
				<div class="day">{i}</div>
			{/if}
		</button>
	{/each}
	<!-- Fill day next month -->
	{#if (DAYTOFILL - fillerDays - thisMonth.getUTCDate() - 1) % 7 != 0}
		{#each range(1, ((DAYTOFILL - fillerDays - thisMonth.getUTCDate() - 1) % 7) + 1) as i}
			<div class="day filler">{i}</div>
		{/each}
	{/if}
</div>

<style lang="scss">
	@use '$lib/color';

	.daySelector {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		grid-template-rows: repeat(6, minmax(0, 1fr));
		place-items: center;
		width: 100%;
		height: 100%;
	}

	strong {
		color: inherit;
	}

	.filler {
		color: hsl(color.$main-hue, color.$main-saturation, 25%, 50%);
	}

	.day {
		font-size: 1.25rem;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.day.today {
		background-color: hsl(color.$main-hue, color.$main-saturation, 50%);
		border-radius: 50%;
	}

	.day.selected {
		background-color: hsl(color.$main-hue, color.$main-saturation, 75%);
		border-radius: 50%;
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
