import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appiontment, AppiontmentMember } from "src/model/sql-entity/appiontment.entity";
import { AppiontmentController } from "./appiontment.controller";
import { AppiontmentService } from "./appiontment.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([ Appiontment, AppiontmentMember ])
  ],
  controllers: [ AppiontmentController ],
  providers: [ AppiontmentService ]
})
export class AppiontmentModule { }
