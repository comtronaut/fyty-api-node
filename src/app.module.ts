import { CacheModule, Module } from "@nestjs/common";
import { AdminModule } from "./modules/admin/admin.module";
import { AppointmentModule } from "./modules/appointment/appointment.module";
import { AuthModule } from "./modules/auth/auth.module";
import { GameModule } from "./modules/game/game.module";
import { ImageModule } from "./modules/image/image.module";
import { NotifyModule } from "./modules/notification/lineNotify.module";
import { ReviewModule } from "./modules/review/review.module";
import { RoomModule } from "./modules/room/room.module";
import { PasswordResetSessionModule } from "./modules/session/password-reset-sessions.module";
import { TeamModule } from "./modules/team/team.module";
import { UserModule } from "./modules/user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { MeModule } from "./modules/me/me.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    PasswordResetSessionModule,
    GameModule,
    TeamModule,
    RoomModule,
    AppointmentModule,
    ReviewModule,
    ImageModule,
    MeModule,
    AdminModule,
    NotifyModule,
    PrismaModule,
    CacheModule.register({
      ttl: 1000 * 60 * 60,
      isGlobal: true
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
