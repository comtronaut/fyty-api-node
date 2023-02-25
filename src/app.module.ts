import { Module } from "@nestjs/common";
import { ApiModule } from "./api/api.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./services/prisma.service";

@Module({
  imports: [ PrismaService, ApiModule, AuthModule ],
  controllers: [],
  providers: []
})
export class AppModule {}
