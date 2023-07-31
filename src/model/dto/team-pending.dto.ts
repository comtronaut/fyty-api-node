import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import {
  TeamPendingOptionalDefaultsSchema,
  TeamPendingPartialSchema,
  TeamPendingSchema
} from "model/schema";

export class TeamPendingDto extends createZodDto(TeamPendingSchema) {}

export class CreateTeamPendingDto
  extends createZodDto(TeamPendingOptionalDefaultsSchema)
  implements Prisma.TeamPendingUncheckedCreateInput {}

export class UpdateTeamPendingDto extends createZodDto(TeamPendingPartialSchema) {}
