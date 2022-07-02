import { Module } from "@nestjs/common";
import { ImageModule } from "./images/image.module";

@Module({
  imports: [
    ImageModule
  ],
  controllers: [ ],
  providers: [ ]
})
export class UtilModule { }
