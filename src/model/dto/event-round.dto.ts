import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { EventRoundOptionalDefaultsSchema, EventRoundPartialSchema } from "model/schema";

export class CreateEventRoundDto
  extends createZodDto(EventRoundOptionalDefaultsSchema)
  implements Prisma.EventRoundUncheckedCreateInput {}

export class UpdateEventRoundDto extends createZodDto(EventRoundPartialSchema) {}
