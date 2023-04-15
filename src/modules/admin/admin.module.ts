import { Module } from "@nestjs/common";
import { AdminAppoinmentsModule } from "./admin-appointments/admin-appointments.module";
import { AdminGamesModule } from "./admin-games/admin-games.module";
import { AdminRoomrsModule } from "./admin-rooms/admin-rooms.module";
import { AdminTeamsModule } from "./admin-teams/admin-teams.module";
import { AdminUsersModule } from "./admin-users/admin-users.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  controllers: [ AdminController ],
  providers: [ AdminService ],
  imports: [
    AdminGamesModule,
    AdminUsersModule,
    AdminTeamsModule,
    AdminRoomrsModule,
    AdminAppoinmentsModule
  ]
})
export class AdminModule {}
