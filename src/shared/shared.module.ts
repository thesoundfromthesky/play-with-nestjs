import { Module } from "@nestjs/common";
import { guardProviders } from "./guards";

@Module({
  providers: [...guardProviders],
  exports: [...guardProviders]
})
export class SharedModule {}
