import { test, expect } from '@playwright/test';
import { rankingUrls } from '../src/schedule';

test('five Japan-time runs cover each ranking twice per day', () => {
  for (const count of [0, 1, 8, 11]) {
    const urls = Array.from({ length: count }, (_, i) => `ranking-${i}`);
    const runs = [0, 8, 14, 19, 22].map(hour =>
      rankingUrls(urls, new Date(`2026-11-03T${String(hour).padStart(2, '0')}:05:00+09:00`)));
    expect(runs.flat()).toEqual([...urls, ...urls]);
    for (const url of urls) expect(runs.flat().filter(item => item === url)).toHaveLength(2);
    if (count === 8) expect(runs.map(run => run.length)).toEqual([3, 3, 3, 3, 4]);
  }
});
