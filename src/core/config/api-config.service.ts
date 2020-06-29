import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
    constructor(private configService: ConfigService) {}

    get baseUrl(): string {
      return this.configService.get("local.baseUrl");
    }
  
    get port(): string {
      return this.configService.get("local.port");
    }
  
    get redirect(): string {
      return this.configService.get("local.redirect");
    }
    get redisUrl(): string {
      return this.configService.get("redis.url");
    }
  
    get jwtSecret(): string {
      return this.configService.get("jwt.secret");
    }
  
    get jwtExpiresInAccessToken(): string {
      return this.configService.get("jwt.expiresInAccessToken");
    }
  
    get jwtExpiresInRefreshToken(): string {
      return this.configService.get("jwt.expiresInRefreshToken");
    }
  
    get mongoDbHost(): string {
      return this.configService.get("mongoDb.host");
    }
  
    get googleClientId(): string {
      return this.configService.get("google.clientId");
    }
  
    get googleClientSecret(): string {
      return this.configService.get("google.clientSecret");
    }
}
