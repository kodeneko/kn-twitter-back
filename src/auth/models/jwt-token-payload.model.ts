interface JwtTokenPayload {
  sub: string; // user id
  name?: string;
  email?: string;
  iss?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: string | number | undefined; // permite claims adicionales opcionales
}

export type { JwtTokenPayload };
