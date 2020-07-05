import { JwtModuleAsyncOptions } from "@nestjs/jwt";
import { JwtConfigService } from "./jwt-config.service";
import { ApiConfigModule } from "../api-config.module";


export const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
  imports: [ApiConfigModule],
  useExisting: JwtConfigService
};

// export const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
//   imports: [ApiConfigModule],
//   useFactory: async (apiConfigService: ApiConfigService) => ({
//     secret: apiConfigService.jwtSecret,
//     signOptions: { expiresIn: "60s" }
//   }),
//   inject: [ApiConfigService]
// };
