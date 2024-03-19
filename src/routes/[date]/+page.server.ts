import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { reservations } from '$lib/common';
import { env } from '$env/dynamic/private';

export const actions = {
	add: async (event) => {
		const now = new Date();
		const secrate = event.cookies.get('key') === env.API_SECRET;
		const data = await event.request.formData();
		const startTime = data.get('start') ?? '';
		const endTime = data.get('end') ?? '';
		const eventName = data.get('name') ?? '';

		const reDate = /^\d{4}-\d{1,2}-\d{1,2}$/;
		const reTime = /^\d{4}-\d{1,2}-\d{1,2}T[0-9]{1,2}:[0-9]{1,2}/;
		const reTitle = /[A-Za-zÀ-ÖØ-öø-ÿ0-9_ ()"-]+/;

		if (!reTitle.test(eventName.toString()))
			return fail(400, {
				eventName: '',
				startTime,
				endTime,
				msg: 'Invalid event name: you may only use letters, numbers and the following symbols: _ ) ( ".'
			});
		else if (!reTime.test(startTime.toString()))
			return fail(400, {
				eventName,
				startTime: '',
				endTime,
				msg: 'Start time was sent in an incompatible format. This should not happen: contact an administrator.'
			});
		else if (!reTime.test(endTime.toString()))
			return fail(400, {
				eventName,
				startTime,
				endTime: '',
				msg: 'End time was sent in an incompatible format. This should not happen: contact an administrator.'
			});
		else if (!reDate.test(event.params.date))
			return fail(400, {
				eventName,
				startTime,
				endTime,
				msg: 'Event date was sent in an incompatible format (accepted format is YYYY-MM-DD). This should not happen: contact an administrator.'
			});

		let startDateTime: Date;
		try {
			startDateTime = new Date(startTime.toString());
		} catch (err) {
			return fail(400, {
				eventName,
				startTime,
				endTime,
				msg: 'There was an error in validating the start time. Please contact an administrator.'
			});
		}

		let endDateTime: Date;
		try {
			endDateTime = new Date(endTime.toString());
		} catch (err) {
			return fail(400, {
				eventName,
				startTime,
				endTime,
				msg: 'There was an error in validating the end time. Please contact an administrator.'
			});
		}

		if (startDateTime.getTime() >= endDateTime.getTime())
			return fail(400, {
				eventName,
				startTime,
				endTime: '',
				msg: 'The start time must be before the end time!'
			});
		else if (Math.abs(startDateTime.getTime() - endDateTime.getTime()) > 1000 * 60 * 60 * 4)
			return fail(400, {
				eventName,
				startTime,
				endTime: '',
				msg: "You can't book the room for more than 4 hours!"
			});
		else if (
			!secrate &&
			startDateTime.getTime() >=
				new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).getTime() &&
			endDateTime.getTime() >=
				new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).getTime()
		)
			return fail(400, {
				eventName,
				startTime: '',
				endTime: '',
				msg: "You can't book this far into the future!"
			});
		else if (startDateTime.getTime() <= now.getTime() && endDateTime.getTime() <= now.getTime())
			return fail(400, {
				eventName,
				startTime: '',
				endTime: '',
				msg: "You can't book a spot in the past!"
			});
		else if (
			reservations.reduce(
				(prev, it) =>
					prev ||
					(startDateTime.getTime() < it.end.getTime() &&
						startDateTime.getTime() >= it.start.getTime()) ||
					(endDateTime.getTime() <= it.end.getTime() && endDateTime.getTime() > it.start.getTime()),
				false
			)
		)
			return fail(400, {
				eventName,
				startTime: '',
				endTime: '',
				msg: 'There is already a reservation at this time!'
			});

		const newData = {
			title: eventName.toString(),
			start: startDateTime,
			end: endDateTime
		};

		reservations.push(newData);

		return { newData, msg: 'success' };
	}
} satisfies Actions;
