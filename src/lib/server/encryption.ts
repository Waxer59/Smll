import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // recommended for GCM
const TAG_LENGTH = 16;

function getKeyFromPassphrase(passphrase: string) {
  return crypto.createHash('sha256').update(passphrase).digest();
}

export function encrypt(text: string): string {
  const passphrase = process.env.SHORTENED_LINK_PASSPHRASE;

  if (!passphrase) {
    console.warn('SHORTENED_LINK_PASSPHRASE not set — storing plaintext');
    return text;
  }

  const key = getKeyFromPassphrase(passphrase);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(payload: string): string {
  const passphrase = process.env.SHORTENED_LINK_PASSPHRASE;

  if (!passphrase) {
    return payload;
  }

  try {
    const data = Buffer.from(payload, 'base64');
    const iv = data.slice(0, IV_LENGTH);
    const tag = data.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const ciphertext = data.slice(IV_LENGTH + TAG_LENGTH);
    const key = getKeyFromPassphrase(passphrase);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.warn(
      'Failed to decrypt shortened link, returning original payload',
      err
    );
    return payload;
  }
}
