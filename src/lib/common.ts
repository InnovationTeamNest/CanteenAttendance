export const reservations: { title: string; start: Date; end: Date }[] = [];

export const range = (start: number, end: number, step: number = 1) =>
	Array.from({ length: Math.floor((end - start) / step) }, (_, k) => k * step + start);
