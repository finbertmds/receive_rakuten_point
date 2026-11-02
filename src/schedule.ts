export function isAM(date = new Date()): boolean {
  const period = process.env.RUN_PERIOD;
  if (period && !['AM', 'PM'].includes(period)) throw new Error('RUN_PERIOD must be AM or PM');
  return period ? period === 'AM' : Number(new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Tokyo',
  }).format(date)) < 12;
}

export function kujiRange(count: number, part: 0 | 1, morning: boolean): [number, number] {
  const half = Math.round(count / 2);
  const quarter = Math.round(half / 2);
  const threeQuarters = Math.round(count * 3 / 4);
  return morning ? (part === 0 ? [0, quarter] : [quarter, half])
    : (part === 0 ? [half, threeQuarters] : [threeQuarters, count]);
}

export function third<T>(items: T[], part: number): T[] {
  return items.slice(Math.floor(items.length * part / 3), Math.floor(items.length * (part + 1) / 3));
}

export function rankingUrls<T>(items: T[], date = new Date()): T[] {
  const hour = Number(new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Tokyo',
  }).format(date));
  const hours = [0, 8, 14, 19, 22];
  const slot = hours.filter(start => hour >= start).length - 1;
  // Split two complete passes across the five daily runs.
  const start = Math.floor(items.length * 2 * slot / hours.length);
  const end = Math.floor(items.length * 2 * (slot + 1) / hours.length);
  return Array.from({ length: end - start }, (_, i) => items[(start + i) % items.length]);
}
