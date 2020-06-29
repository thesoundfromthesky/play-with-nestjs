import { ApiConfigModule } from "../api-config.module";
import { ApiConfigService } from '../api-config.service';
import { MongooseConfigService } from "./mongoose-config.service";

export const mongooseModuleAsyncOptions = {
  imports: [ApiConfigModule],
  useExisting: MongooseConfigService
};

// export const mongooseModuleAsyncOptions = {
//   imports: [ApiConfigModule],
//   useFactory: async (apiConfigService: ApiConfigService) => ({
//     uri: apiConfigService.mongoDbHost,
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     // ,autoCreate: true
//     // ,autoIndex:false
//     connectionFactory: connection => {
//       connection.plugin(require("mongoose-lean-virtuals"));
//       connection.plugin(require("mongoose-lean-getters"));
//       connection.plugin(require("mongoose-lean-defaults"));
//       return connection;
//     }
//   }),
//   inject: [ApiConfigService]
// };
