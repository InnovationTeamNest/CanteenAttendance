<script lang="ts">
	import { range } from '$lib/common';
	import { get } from 'svelte/store';
	export let datas: { title: string; start: string; end: string }[];
	export let classes: string = '';
	$: datasMap = datas.map((it) => {
		return {
			title: it.title,
			start: new Date(it.start),
			end: new Date(it.end)
		};
	});

	// based on available space, we compute the precision of the grid, i.e.
	// the number of hours per tick
	let root = null;
	let precision = 1;
	let eventsPositions: { top: number; height: number; isActive: boolean }[] = [];
	let observerSet = false;

	export const getSlotAtHour = (hour: number) => {
		if (!root) return null;
		return root.querySelector(`.time:nth-child(${hour + 1})`);
	};

	const getSlotForHour = (startDate: Date, endDate: Date) => {
		if (!root) return { top: 0, height: 0 };
		const startHour = startDate.getHours(),
			endHour = endDate.getHours();
		const startHourOffset = startDate.getMinutes() / 60;
		const endHourOffset = endDate.getMinutes() / 60;

		const boundingRect = root
			.querySelector(`.time:nth-child(${startHour + 1})`)
			.getBoundingClientRect();
		const hourOffsetPx = startHourOffset * boundingRect.height;
		const topRelativeToParent = boundingRect.top - root.getBoundingClientRect().top;
		const height = boundingRect.height * (endHour - startHour + endHourOffset - startHourOffset);

		return { top: topRelativeToParent + hourOffsetPx, height };
	};

	function updatePositions(reservationsList) {
		let idx = 0;
		for (const reserv of reservationsList) {
			const { top, height } = getSlotForHour(reserv.start, reserv.end);
			const now = new Date();
			const isActive = now >= reserv.start && now <= reserv.end;
			eventsPositions[idx] = { top, height, isActive };
			idx++;
		}
	}

	// watch resize of root
	$: if (typeof window !== 'undefined') {
		const resizeObserver = new ResizeObserver((entries) => {
			updatePositions(datasMap);
		});

		if (root && !observerSet) {
			resizeObserver.observe(root);
			observerSet = true;
		}
	}

	$: updatePositions(datasMap);

	export const getSlotCoordinates = getSlotForHour;
</script>

<div bind:this={root} class="root {classes}">
	<div class="bg-layer">
		{#each range(0, 24, precision) as i}
			<div class="time">{i}:00</div>
		{/each}
	</div>
	<div class="event-layer">
		{#each datasMap as reserv, idx}
			<div
				class="res-event"
				class:active={eventsPositions[idx]?.isActive}
				style="
				top: {eventsPositions[idx]?.top}px;
				height: {eventsPositions[idx]?.height}px;"
			>
				<div class="sticky top-0">
					<strong>{reserv.title}</strong>
					<div class="text-sm">
						<span
							>{reserv.start.toLocaleString(navigator.language, {
								hour: '2-digit',
								minute: '2-digit'
							})}</span
						>
						-
						<span
							>{reserv.end.toLocaleString(navigator.language, {
								hour: '2-digit',
								minute: '2-digit'
							})}</span
						>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	@use '$lib/color';

	.root {
		position: relative;
		/* take max of parent up until 500px */
		height: 100%;
	}

	.bg-layer {
		max-height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(24, 1fr);
	}

	.bg-layer .time {
		height: 64px;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		border-top: 1px solid hsla(color.$main-hue, color.$main-saturation, 25%, 0.3);
	}

	.event-layer {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
	}

	.event-layer .res-event {
		position: absolute;
		width: calc(100% - 60px);
		left: 60px;
		background-color: hsla(color.$main-hue, color.$main-saturation, 65%, 0.9);
		border: 1px solid hsla(color.$main-hue, color.$main-saturation, 25%, 0.4);
		box-shadow: inset 0 -2px 0 0 hsla(color.$main-hue, color.$main-saturation, 25%, 0.2);
		border-radius: 4px;
		padding: 4px;
	}

	.event-layer .res-event.active {
		animation: breathing 1.6s infinite;
	}

	@keyframes breathing {
		0% {
			background-color: hsla(color.$main-hue, color.$main-saturation, 65%, 0.9);
		}
		50% {
			background-color: hsla(color.$main-hue, color.$main-saturation, 55%, 0.9);
		}
		100% {
			background-color: hsla(color.$main-hue, color.$main-saturation, 65%, 0.9);
		}
	}
</style>
