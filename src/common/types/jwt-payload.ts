/**
 * Formato do payload assinado dentro do access token.
 */
export type JwtAccessPayload = {
  sub: string;
  type: 'access';
  iat: number;
  exp: number;
};

/**
 * Usuário autenticado, anexado em `request.user` pela JwtStrategy.
 */
export type TAuthenticatedUser = {
  id: string;
  issuedAt: number;
  expiration: number;
};
