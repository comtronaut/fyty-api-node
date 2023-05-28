import { Global, Module } from "@nestjs/common";

import { ImageService } from "./image.service";

@Global()
@Module({
  exports: [ ImageService ],
  providers: [ ImageService ]
})
export class ImageModule {}
