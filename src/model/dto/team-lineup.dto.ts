import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { TeamLineupOptionalDefaultsSchema, TeamLineupSchema } from "model/schema";

export class CreateTeamLineupDto
  extends createZodDto(TeamLineupOptionalDefaultsSchema)
  implements Prisma.TeamLineupUncheckedCreateInput {}

export class UpdateLineupDto extends createZodDto(TeamLineupSchema.partial()) {}
