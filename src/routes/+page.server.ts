import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export function load() {
	const date = new Date();
	throw redirect(303, `${base}/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
}
