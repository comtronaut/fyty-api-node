import { Module } from "@nestjs/common";

import { TrainingService } from "modules/team/services/training.service";

import { AdminTrainingsController } from "./admin-trainings.controller";

@Module({
  controllers: [ AdminTrainingsController ],
  providers: [ TrainingService ]
})
export class AdminTrainingsModule {}
