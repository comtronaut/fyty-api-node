import { Module } from "@nestjs/common";
import { SelectorController } from "./selector.controller";
import { SelectorService } from "./selector.service";

@Module({
  imports: [],
  controllers: [ SelectorController ],
  providers: [ SelectorService ]
})
export class SelectorModule {}
