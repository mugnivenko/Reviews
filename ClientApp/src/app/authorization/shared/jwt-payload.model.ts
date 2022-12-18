type Uuid = string;

export type JwtPayload = {
  email: string;
  exp: number;
  iat: number;
  iss: string;
  jti: Uuid;
  nbf: number;
  sub: Uuid;
  userName: string;
};
