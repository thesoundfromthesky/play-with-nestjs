import { Name } from "../../../schemas";

export class NameEntity implements Name {
  readonly familyName: string;
  readonly givenName: string;
}
