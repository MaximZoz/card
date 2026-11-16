import { periodText } from '../config/configuration';
import { formatPeriod } from './profile.service';

describe('formatPeriod', () => {
  it('подставляет подпись из конфигурации, если месяц окончания пуст', () => {
    expect(formatPeriod('2020-01', null, periodText)).toBe('2020-01 — по настоящее время');
  });

  it('показывает оба месяца', () => {
    expect(formatPeriod('2020-01', '2026-11', periodText)).toBe('2020-01 — 2026-11');
  });
});
