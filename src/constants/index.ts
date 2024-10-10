export const SHORT_ID_INITIAL_LENGTH = 5;
export const SHORT_ID_MAX_LENGTH = 12;
export const SALT_ROUNDS = 10;
export const LONG_LINK_EXAMPLE =
  'https://verylonglink.com/abc123?is=verylong&really=long&iSaid=itwasReallyLong';
export const AUTH_PATHNAMES = [
  '/mfa',
  '/mfa-recovery',
  '/magic-link',
  '/login',
  '/register',
  '/forgot-password'
];
export const BROADCAST_CHANNEL_AUTH = 'smll-auth';
export const BROADCAST_CHANNEL_VERIFICATION_MESSAGE = 'verified';
export enum Cookies {
  session = 'session'
}
export enum APPWRITE_DATABASES {
  link_shortener = '66c650f300086a58aaae'
}
export enum APPWRITE_COLLECTIONS {
  metrics = '66d1e85c00025d385e8b',
  shortened_links = '66d1c04a0003d4b43a6b',
  links = '66c65133002874f85e10',
  account_tokens = '66ff0e5f000684a671a2'
}
export enum APPWRITE_PROVIDERS {
  oauth2 = 'oauth2',
  magicUrl = 'magic-url'
}
