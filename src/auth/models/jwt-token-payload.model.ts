interface JwtTokenPayload {
  sub: string; // user id
  name?: string;
  email?: string;
  admin: boolean;
  iss?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: string | number | boolean | undefined; // permite claims adicionales opcionales
}

export type { JwtTokenPayload };
