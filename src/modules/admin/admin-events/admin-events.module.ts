import { Module } from "@nestjs/common";

import { EventService } from "modules/event/event.service";

import { AdminEventsController } from "./admin-events.controller";

@Module({
  controllers: [ AdminEventsController ],
  providers: [ EventService ]
})
export class AdminEventsModule {}
