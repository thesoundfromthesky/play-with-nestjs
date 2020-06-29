import { SetMetadata } from "@nestjs/common";
import { Role } from "src/mongoose";

export const Roles = (...args: Role[]) => SetMetadata("roles", args);
