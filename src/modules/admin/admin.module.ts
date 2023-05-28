import { Module } from "@nestjs/common";

import { AdminAdminsModule } from "./admin-admins/admin-admins.module";
import { AdminAppoinmentsModule } from "./admin-appointments/admin-appointments.module";
import { AdminGamesModule } from "./admin-games/admin-games.module";
import { AdminReportsModule } from "./admin-reports/admin-reports.module";
import { AdminRoomsModule } from "./admin-rooms/admin-rooms.module";
import { AdminTeamsModule } from "./admin-teams/admin-teams.module";
import { AdminTrainingsModule } from "./admin-traininings/admin-trainings.module";
import { AdminUsersModule } from "./admin-users/admin-users.module";

@Module({
  imports: [
    AdminReportsModule,
    AdminTrainingsModule,
    AdminAdminsModule,
    AdminGamesModule,
    AdminUsersModule,
    AdminTeamsModule,
    AdminRoomsModule,
    AdminAppoinmentsModule
  ]
})
export class AdminModule {}
