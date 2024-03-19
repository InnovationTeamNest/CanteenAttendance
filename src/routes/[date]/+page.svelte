<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import createTranslator from '$lib/translator';

	import YearSelector from './YearSelector.svelte';
	import MonthSelector from './MonthSelector.svelte';
	import DaySelector from './DaySelector.svelte';
	import { IconCalendarPlus } from '@tabler/icons-svelte';
	import ReservationList from './ReservationList.svelte';
	import AddReservationDialog from './AddReservationDialog.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;

	let date = new Date(data.date);
	$: date = new Date(data.date);
	let initialYear = date.getFullYear();
	let initialMonth = date.getMonth();
	let initialDay = date.getDate();
	let year = initialYear;
	let month = initialMonth;
	let day = initialDay;
	$: tr = createTranslator(navigator.language);

	const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

	$: todayWeekday = capitalize(
		date.toLocaleString(navigator.language, {
			weekday: 'long'
		})
	);

	$: todayDate = date.toLocaleString(navigator.language, {
		month: 'long',
		day: '2-digit',
		year: 'numeric'
	});

	let nowClock = new Date();
	$: now = nowClock.toLocaleString(navigator.language, {
		hour: '2-digit',
		minute: '2-digit'
	});

	setInterval(() => {
		nowClock = new Date();
	}, 1000);

	let eventsBox: HTMLDivElement;
	let resList: ReservationList;

	onMount(() => {
		if (eventsBox && resList) {
			const topCoordinate = resList.getSlotCoordinates(nowClock, nowClock);
			const slotObj = resList.getSlotAtHour(nowClock.getHours());
			eventsBox.scrollTo({ top: topCoordinate.top, behavior: 'smooth' });
		}
	});

	$: if (
		typeof window !== 'undefined' &&
		typeof year === 'number' &&
		typeof month === 'number' &&
		typeof day === 'number' &&
		typeof initialYear === 'number' &&
		typeof initialMonth === 'number' &&
		typeof initialDay === 'number' &&
		(day !== initialDay || month !== initialMonth || year !== initialYear)
	) {
		goto(`${year}-${month + 1}-${day}`);
		initialYear = year;
		initialMonth = month;
		initialDay = day;
	}

	let isModal: boolean = false;
	function showModal() {
		isModal = !isModal;
	}
</script>

<div class="lg:flex items-center justify-center w-[100vw] h-[100vh]">
	<div
		class="cal-container lg:rounded-md lg:h-min lg:max-h-[500px] h-screen max-h-screen grid lg:grid-cols-[2fr,3fr] lg:grid-rows-1 grid-rows-[minmax(min-content,2fr),minmax(0,3fr)]"
	>
		<div class="lg:order-2 lg:rounded-r-md p-4">
			<div class="cal-header flex flex-wrap">
				<YearSelector classes="flex-1 justify-end" bind:year />
				<MonthSelector bind:month />
				<hr class="hr-divider" />
			</div>
			<div class="main">
				<DaySelector {year} {month} bind:day />
			</div>
		</div>
		<div
			class="today border-r-0 lg:order-1 lg:rounded-l-md max-lg:border-t-2 lg:rounded-l-md lg:border-r-2 lg:pr-4 lg:mr-4 p-4"
		>
			<div class="inner flex flex-col min-h-0 h-full">
				<div class="flex items-center">
					<div class="text-3xl font-bold scale-y-[200%] scale-x-125 origin-left mr-8">{now}</div>
					<div class="whitespace-nowrap">
						<div class="text-lg">
							{todayWeekday}
						</div>
						<div class="text-xl font-medium">
							{todayDate}
						</div>
					</div>
					<div class="flex-1"></div>
					<button class="ml-4" on:click={showModal}>
						<IconCalendarPlus size={48} />
					</button>
				</div>
				<div class="flex items-center justify-between mt-4">
					<strong class="text-lg">{tr('Current reservations')}</strong>
				</div>
				<div bind:this={eventsBox} class="flex-1 h-full overflow-auto">
					<ReservationList bind:this={resList} datas={data.reservations} />
				</div>
			</div>
		</div>
	</div>
</div>
<AddReservationDialog bind:show={isModal} submitRes={form} />

<style lang="scss">
	@use '$lib/color';

	.cal-container {
		background-color: hsl(color.$main-hue, color.$main-saturation, 85%);
	}

	.cal-header {
		color: hsl(color.$main-hue, color.$main-saturation, 25%);
	}

	.cal-header .hr-divider {
		height: 2px;
		width: 100%;
		border-width: 0px;
		border-top: 2px dashed hsl(color.$main-hue, color.$main-saturation, 25%);
	}

	.main {
		color: hsl(color.$main-hue, color.$main-saturation, 25%);
	}

	.today {
		border-style: solid;
		border-color: hsl(color.$main-hue, color.$main-saturation, 35%);
		background-color: hsl(color.$main-hue, color.$main-saturation, 78%);
		color: hsl(color.$main-hue, color.$main-saturation, 25%);
	}

	button,
	input[type='submit'],
	input[type='reset'] {
		width: min-content;
		height: min-content;
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
