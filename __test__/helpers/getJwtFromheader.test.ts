import { getJwtFromHeader } from '@/helpers/getJwtFromHeader';
import { describe, expect, it } from 'vitest';

describe('Test getJwtFromHeader', () => {
  it('should return null if authorization header is null', () => {
    const authorization = null;
    const result = getJwtFromHeader(authorization);
    expect(result).toBeNull();
  });

  it('should return null if authorization header is empty', () => {
    const authorization = '';
    const result = getJwtFromHeader(authorization);
    expect(result).toBeNull();
  });

  it('should return jwt if authorization header is valid', () => {
    const authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const result = getJwtFromHeader(authorization);
    expect(result).toBe(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    );
  });
});
