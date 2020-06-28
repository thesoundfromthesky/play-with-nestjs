import { IsString } from "class-validator";
import { Name } from "../../../schemas";

export class NameDto implements Name {
  @IsString()
  readonly familyName: string;
  @IsString()
  readonly givenName: string;
}
