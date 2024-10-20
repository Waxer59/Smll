import { assert, describe, it } from 'vitest';
import { areAllLinksPasswordsUnique } from '@/helpers/areAllLinksPasswordsUnique';

describe('Test areAllLinksPasswordsUnique', () => {
  it('should return true, all links passwords are unique', () => {
    const links = [
      {
        url: 'https://www.google.com',
        password: 'password'
      },
      {
        url: 'https://www.google.com',
        password: 'password2'
      }
    ];

    const result = areAllLinksPasswordsUnique(links);

    assert.equal(result, true);
  });
  it('should return false, one link password is the same as another link password', () => {
    const links = [
      {
        url: 'https://www.google.com',
        password: 'password'
      },
      {
        url: 'https://www.google.com',
        password: 'password'
      }
    ];

    const result = areAllLinksPasswordsUnique(links);

    assert.equal(result, false);
  });
});
