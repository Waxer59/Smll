export function getJwtFromHeader(authorization: string | null) {
  if (!authorization) return null;

  const bearerToken = authorization.split(' ')[1];
  return bearerToken;
}
