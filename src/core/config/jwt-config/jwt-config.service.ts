import { Injectable } from "@nestjs/common";
import { JwtOptionsFactory, JwtModuleOptions } from "@nestjs/jwt";
import { ApiConfigService } from "../api-config.service";
;

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly apiConfigService: ApiConfigService) {}
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.apiConfigService.jwtSecret,
      signOptions: { expiresIn: this.apiConfigService.jwtExpiresInAccessToken }
    };
  }
}
