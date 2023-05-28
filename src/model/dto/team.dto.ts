import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { TeamOptionalDefaultsSchema, TeamPartialSchema } from "model/schema";

export class CreateTeamDto
  extends createZodDto(TeamOptionalDefaultsSchema)
  implements Prisma.TeamUncheckedCreateInput {}

export class UpdateTeamDto extends createZodDto(TeamPartialSchema) {}
