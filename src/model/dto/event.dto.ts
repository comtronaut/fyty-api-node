import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  AppointmentSchema,
  EventOptionalDefaultsSchema,
  EventPartialSchema,
  EventParticipantSchema,
  EventRoundSchema,
  EventSchema
} from "model/schema";

export class CreateEventDto
  extends createZodDto(EventOptionalDefaultsSchema)
  implements Prisma.EventUncheckedCreateInput {}

export class UpdateEventDto extends createZodDto(EventPartialSchema) {}

export class EventDetailResponseDto extends createZodDto(
  EventSchema.extend({
    rounds: EventRoundSchema.array(),
    participants: EventParticipantSchema.array()
  })
) {}

export class CreateEventAppointmentsDto extends createZodDto(
  AppointmentSchema.pick({
    startAt: true,
    endAt: true
  }).extend({
    roundId: z.string().cuid().optional(),
    matches: z
      .object({
        hostTeamId: z.string().cuid(),
        guestTeamId: z.string().cuid(),
        roomName: z.string()
      })
      .array()
  })
) {}
