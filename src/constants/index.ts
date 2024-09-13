export const SHORT_ID_INITIAL_LENGTH = 5;
export const SHORT_ID_MAX_LENGTH = 12;
export const PROTECTED_PATHNAMES = ['/dashboard'];
export const PUBLIC_PATHNAMES = [
  '/',
  '/magic-link',
  '/login',
  '/register',
  '/forgot-password'
];
export enum Cookies {
  session = 'session'
}
export enum APPWRITE_DATABASES {
  link_shortener = '66c650f300086a58aaae'
}
export enum APPWRITE_COLLECTIONS {
  tags = '66def5f800297431521f',
  metrics = '66d1e85c00025d385e8b',
  users = '66d1c3eb00348c6a40f4',
  shortened_links = '66d1c04a0003d4b43a6b',
  links = '66c65133002874f85e10'
}
