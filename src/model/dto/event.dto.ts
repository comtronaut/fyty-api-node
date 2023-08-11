import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { EventOptionalDefaultsSchema, EventPartialSchema } from "model/schema";

export class CreateEventDto
  extends createZodDto(EventOptionalDefaultsSchema)
  implements Prisma.EventUncheckedCreateInput {}

export class UpdateEventDto extends createZodDto(EventPartialSchema) {}
