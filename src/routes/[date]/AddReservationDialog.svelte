<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types';
	import createTranslator from '$lib/translator';

	$: tr = createTranslator(navigator.language);

	const formEnhance: SubmitFunction = ({ formElement, formData, action, cancel }) => {
		const start = new Date(formData.get('start')?.toString() ?? '');
		formData.set('start', start.toISOString());

		const end = new Date(formData.get('end')?.toString() ?? '');
		formData.set('end', end.toISOString());

		return async ({ result, update }) => {
			if (result.type === 'success') {
				formElement.reset();
				dialog.close();
				update();
			}
			await applyAction(result);
		};
	};

	export let show: boolean;
	export let submitRes: ActionData;

	let dialog: HTMLDialogElement;

	$: if (dialog && show) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (show = false)} on:click|self={() => dialog.close()}>
	<form method="post" action="?/add" style="padding: 2rem;" use:enhance={formEnhance}>
		<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 1rem;">
			<label>
				{tr('Event name')}
				<input name="name" type="text" pattern={'[A-Za-zÀ-ÖØ-öø-ÿ0-9_ \\(\\)"-]+'} required />
			</label>
			<label>
				{tr('Start time')}
				<input name="start" type="datetime-local" required />
			</label>
			<label>
				{tr('End time')}
				<input name="end" type="datetime-local" required />
			</label>
			<div style="display: flex; gap:1rem;">
				<button type="submit">{tr('Add')}</button>
				<button type="button" on:click={() => dialog.close()}>{tr('Close')}</button>
			</div>
			{#if $page.status >= 400 && $page.status <= 499}
				<p>{tr(submitRes?.msg ?? '') ?? ''}</p>
			{/if}
		</div>
	</form>
</dialog>

<style lang="scss">
	dialog {
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		@keyframes zoom {
			from {
				transform: scale(0);
			}
			to {
				transform: scale(1);
			}
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
		@keyframes fade {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}

	button {
		display: block;
	}
	input:invalid {
		background: hsl(0deg, 100%, 90%);
	}
</style>
