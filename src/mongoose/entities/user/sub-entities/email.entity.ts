import { Email } from "../../../schemas";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class EmailEntity implements Email {
  @Expose()
  value: string;
  verified: boolean;
}
