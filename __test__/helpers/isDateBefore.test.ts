import { isDateBefore } from '@/helpers/isDateBefore';
import { describe, it, assert } from 'vitest';

describe('Test isDateBefore', () => {
  it('should return true, date is before compare date', () => {
    const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2);
    const compareDate = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * 2
    );

    const result = isDateBefore(date, compareDate);

    assert.equal(result, true);
  });
  it('should return false, date is after compare date', () => {
    const date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2);
    const compareDate = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 24 * 2
    );

    const result = isDateBefore(date, compareDate);

    assert.equal(result, false);
  });
});
