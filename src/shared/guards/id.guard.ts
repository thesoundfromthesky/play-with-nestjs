import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "src/mongoose";

@Injectable()
export class IdGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    for (const  role of request.user.roles) {
      if (role === Role.Admin) {
        return true;
      }
    }
    if (request.user.id === request.params.id) {
      return true;
    }
    return false;
  }
}
