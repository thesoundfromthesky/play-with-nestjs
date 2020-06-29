import { Role, Email } from "src/mongoose";

export interface JwtPayload {
  id: string;
  emails: Email[];
  roles: Role[];
}
