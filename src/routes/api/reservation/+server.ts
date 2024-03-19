import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { reservations } from '$lib/common';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = ({ url, cookies }) => {
	const now = new Date();
	const secrate = cookies.get('key') === env.API_SECRET;
	const year = url.searchParams.get('year');
	const month = url.searchParams.get('month');
	const day = url.searchParams.get('day');

	let date: Date;
	if (year !== null || month !== null || day !== null) {
		date = new Date(Number(year), Number(month), Number(day), 1, 0, 0);
	} else {
		date = new Date();
	}
	return json({
		date: date,
		reservations: reservations.filter((it) => {
			return (
				(secrate || date.getDate() <= now.getDate() + 2) &&
				it.start.getDate() === date.getDate() &&
				it.start.getMonth() === date.getMonth() &&
				it.start.getFullYear() === date.getFullYear()
			);
		})
	});
};
