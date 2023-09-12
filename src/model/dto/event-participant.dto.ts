import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  EventParticipantOptionalDefaultsSchema,
  EventParticipantSchema
} from "model/schema";

export class CreateEventParticipantDto
  extends createZodDto(EventParticipantOptionalDefaultsSchema)
  implements Prisma.EventParticipantUncheckedCreateInput {}

export class UpdateEventParticipantDto extends createZodDto(
  EventParticipantSchema.partial()
) {}

export class EventParticipantApprovalPayloadDto extends createZodDto(
  EventParticipantSchema.pick({ approvalStatus: true }).required().extend({
    participantIds: z.string().cuid().array()
  })
) {}
