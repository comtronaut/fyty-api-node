import { Module } from "@nestjs/common";

import { TrainingService } from "modules/team/training.service";

import { AdminReportsController } from "./admin-reports.controller";

@Module({
  controllers: [ AdminReportsController ],
  providers: [ TrainingService ]
})
export class AdminReportsModule {}
