import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { EventOptionalDefaultsSchema, EventPartialSchema, EventParticipantSchema, EventRoundSchema, EventSchema } from "model/schema";

export class CreateEventDto
  extends createZodDto(EventOptionalDefaultsSchema)
  implements Prisma.EventUncheckedCreateInput {}

export class UpdateEventDto extends createZodDto(EventPartialSchema) {}

export class EventDetailResponseDto
  extends createZodDto(
    EventSchema.extend({
      rounds: EventRoundSchema.array(),
      participants: EventParticipantSchema.array()
    })
  ) {}
