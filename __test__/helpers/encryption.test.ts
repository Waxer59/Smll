import { assert, beforeEach, describe, it, afterEach } from 'vitest';
import { encrypt, decrypt } from '@/lib/server/encryption';

describe('encryption module', () => {
  const PASSPHRASE = 'test-passphrase';

  beforeEach(() => {
    process.env.SHORTENED_LINK_PASSPHRASE = PASSPHRASE;
  });

  afterEach(() => {
    delete process.env.SHORTENED_LINK_PASSPHRASE;
  });

  it('encrypts and decrypts a URL correctly', () => {
    const text = 'https://example.com/test-code';
    const encrypted = encrypt(text);

    assert.notEqual(encrypted, text);

    const decrypted = decrypt(encrypted);

    assert.equal(decrypted, text);
  });

  it('returns plaintext when passphrase is not set', () => {
    delete process.env.SHORTENED_LINK_PASSPHRASE;

    const text = 'https://example.com/plain';
    const encrypted = encrypt(text);

    assert.equal(encrypted, text);
    assert.equal(decrypt(text), text);
  });

  it('returns original payload when decryption fails', () => {
    process.env.SHORTENED_LINK_PASSPHRASE = PASSPHRASE;

    const badPayload = 'not-a-valid-base64-payload';
    const decrypted = decrypt(badPayload);

    assert.equal(decrypted, badPayload);
  });
});
