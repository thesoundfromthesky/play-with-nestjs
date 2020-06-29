import { JwtPayload } from "./jwt-payload.interface";

export interface TokenPayload extends JwtPayload {
  access_token: string;
  refresh_token: string;
}
