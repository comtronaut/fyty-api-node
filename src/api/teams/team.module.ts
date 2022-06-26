import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LineUp } from "src/model/sql-entity/lineUp.entity";
import { Team } from "src/model/sql-entity/team.entity";
import { LineUpService } from "./lineUp/lineUp.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Team, LineUp ])
  ],
  controllers: [ TeamController, LineUpService ],
  providers: [ TeamService, LineUpService ]
})
export class TeamModule { }
