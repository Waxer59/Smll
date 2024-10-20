import { isFutureDate } from '@/helpers/isFutureDate';
import { assert, describe, it } from 'vitest';

describe('Test isFutureDate', () => {
  it('should return true, date is in the future', () => {
    const date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2);

    const result = isFutureDate(date);

    assert.equal(result, true);
  });
  it('should return false, date is not in the future', () => {
    const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2);

    const result = isFutureDate(date);

    assert.equal(result, false);
  });
});
