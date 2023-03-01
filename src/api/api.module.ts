import { Module } from "@nestjs/common";
import { AppointmentModule } from "./appointment/appointment.module";
import { GameModule } from "./games/game.module";
import { PasswordResetSessionModule } from "./password-reset-sessions/password-reset-sessions.module";
import { ReviewModule } from "./review/review.module";
import { RoomModule } from "./rooms/room.module";
import { SelectorModule } from "./Selector/selector.module";
import { TeamModule } from "./teams/team.module";
import { UserModule } from "./users/user.module";
import { UtilModule } from "./utils/util.module";

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
    UtilModule
  ],
  controllers: [],
  providers: []
})
export class ApiModule {}
