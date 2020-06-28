import { Email } from "../../../schemas";
import { IsString, IsOptional } from "class-validator";

export class EmailDto implements Email {
  @IsString()
  @IsOptional()
  value: string;

  verified: boolean;
}
