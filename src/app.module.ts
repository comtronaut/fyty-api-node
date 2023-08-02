import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { AdminModule } from "modules/admin/admin.module";
import { AppointmentModule } from "modules/appointment/appointment.module";
import { AuthModule } from "modules/auth/auth.module";
import { EventModule } from "modules/event/event.module";
import { GameModule } from "modules/game/game.module";
import { ImageModule } from "modules/image/image.module";
import { MeModule } from "modules/me/me.module";
import { NotifyModule } from "modules/notification/notification.module";
import { ReviewModule } from "modules/review/review.module";
import { RoomModule } from "modules/room/room.module";
import { RoutineModule } from "modules/routine/routine.module";
import { SocketModule } from "modules/socket/socket.module";
import { TeamModule } from "modules/team/team.module";
import { UserModule } from "modules/user/user.module";
import { PrismaModule } from "prisma/prisma.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    GameModule,
    TeamModule,
    RoomModule,
    AppointmentModule,
    ReviewModule,
    ImageModule,
    MeModule,
    EventModule,
    AdminModule,
    NotifyModule,
    SocketModule,
    PrismaModule,
    RoutineModule,
    EventEmitterModule.forRoot(),
    CacheModule.register({
      ttl: 1000 * 60 * 60,
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor
    }
  ]
})
export class AppModule {}
