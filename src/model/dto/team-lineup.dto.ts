import { Prisma } from "@prisma/client";

import { TeamLineupOptionalDefaultsSchema, TeamLineupPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateTeamLineupDto
  extends createZodDto(TeamLineupOptionalDefaultsSchema)
  implements Prisma.TeamLineupUncheckedCreateInput {}

export class UpdateLineupDto extends createZodDto(TeamLineupPartialSchema) {}
