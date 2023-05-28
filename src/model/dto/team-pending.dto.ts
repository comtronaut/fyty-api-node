import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { TeamPendingOptionalDefaultsSchema, TeamPendingPartialSchema } from "model/schema";

export class CreateTeamPendingDto
  extends createZodDto(TeamPendingOptionalDefaultsSchema)
  implements Prisma.TeamPendingUncheckedCreateInput {}

export class UpdateTeamPendingDto extends createZodDto(TeamPendingPartialSchema) {}
