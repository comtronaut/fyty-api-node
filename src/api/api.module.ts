import { Module } from "@nestjs/common";
import { AppointmentModule } from "./appointment/appointment.module";
import { DebugModule } from "./debug/debug.module";
import { GameModule } from "./games/game.module";
import { PasswordResetSessionModule } from "./password-reset-sessions/password-reset-sessions.module";
import { ReviewModule } from "./review/review.module";
import { RoomModule } from "./rooms/room.module";
import { SelectorModule } from "./Selector/selector.module";
import { TeamModule } from "./teams/team.module";
import { UserModule } from "./users/user.module";
import { UtilModule } from "./utils/util.module";
import {NotifyModule} from "./line_notify/lineNotify.module"

@Module({
  imports: [
    UserModule,
    PasswordResetSessionModule,
    GameModule,
    TeamModule,
    RoomModule,
    AppointmentModule,
    SelectorModule,
    ReviewModule,
    UtilModule,
    DebugModule,
    NotifyModule
  ],
  controllers: [],
  providers: []
})
export class ApiModule {}
