import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiConfigService } from "src/core";
import { JwtPayload } from "src/shared";
import { SignOptions } from "jsonwebtoken";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly apiConfigService: ApiConfigService
  ) {}

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  canRefresh(token) {
    const exp = token.exp - token.iat;
    const threshold = 60 * 60 * 24 * 7;
    if (exp - threshold < 0) {
      return true;
    }
    return false;
  }
  extractTokenFromBearerToken(bearerToken: string) {
    const [type, token] = bearerToken.split(" ");
    return token;
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.apiConfigService.jwtExpiresInRefreshToken
    } as SignOptions);
  }
}
