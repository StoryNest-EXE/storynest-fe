import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  sub: string;
  unique_name: string;
  email: string;
  type: string;
  jti: string;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}
