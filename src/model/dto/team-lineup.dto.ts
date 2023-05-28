import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { TeamLineupOptionalDefaultsSchema, TeamLineupPartialSchema } from "model/schema";

export class CreateTeamLineupDto
  extends createZodDto(TeamLineupOptionalDefaultsSchema)
  implements Prisma.TeamLineupUncheckedCreateInput {}

export class UpdateLineupDto extends createZodDto(TeamLineupPartialSchema) {}
