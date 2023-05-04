import { Prisma } from "@prisma/client";

import { TeamPendingOptionalDefaultsSchema, TeamPendingPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateTeamPendingDto
  extends createZodDto(TeamPendingOptionalDefaultsSchema)
  implements Prisma.TeamPendingUncheckedCreateInput {}

export class UpdateTeamPendingDto extends createZodDto(TeamPendingPartialSchema) {}
