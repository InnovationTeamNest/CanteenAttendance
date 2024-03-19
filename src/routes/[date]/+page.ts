import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { PageLoad } from './$types';

export const ssr = true;

export const load: PageLoad = async ({ params, fetch }) => {
	if (!/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/.test(params.date)) {
		return error(400, { message: 'Wrong date format, go back to the homepage' });
	}

	const year = parseInt(params.date.split('-')[0]);
	const month = parseInt(params.date.split('-')[1]);
	const day = parseInt(params.date.split('-')[2]);
	const goodDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

	const date = new Date(goodDate);
	const urlParams = new URLSearchParams();
	urlParams.set('day', `${date.getDate()}`);
	urlParams.set('month', `${date.getMonth()}`);
	urlParams.set('year', `${date.getFullYear()}`);
	const resp = await fetch(`${base}/api/reservation?` + urlParams);
	const res = await resp.json();

	return res as Promise<{
		date: string;
		reservations: { title: string; start: string; end: string }[];
	}>;
};
