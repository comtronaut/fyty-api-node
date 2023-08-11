import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import {
  EventParticipantOptionalDefaultsSchema,
  EventParticipantPartialSchema
} from "model/schema";

export class CreateEventParticipantDto
  extends createZodDto(EventParticipantOptionalDefaultsSchema)
  implements Prisma.EventParticipantUncheckedCreateInput {}

export class UpdateEventParticipantDto extends createZodDto(
  EventParticipantPartialSchema
) {}
