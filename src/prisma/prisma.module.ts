import { Global, Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

@Global()
@Module({
  imports: [],
  exports: [ PrismaService ],
  controllers: [],
  providers: [ PrismaService ]
})
export class PrismaModule {}
