import { CacheModule, Module } from "@nestjs/common";
import { ApiModule } from "./api/api.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./services/prisma.service";

@Module({
  imports: [
    ApiModule,
    AuthModule,
    CacheModule.register({
      ttl: 1000 * 60 * 60,
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [ PrismaService ]
})
export class AppModule {}
