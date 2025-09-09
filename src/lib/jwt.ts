import { TokenPayload } from "@/types/jwt.type";
import jwt from "jsonwebtoken";

export const decodeToken = (token: string): TokenPayload =>
  jwt.decode(token) as TokenPayload;

// export const decodeToken = (token: string): JwtPayload =>
//     jwt.decode(token) as JwtPayload;
