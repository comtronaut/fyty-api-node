import { Prisma } from "@prisma/client";

import { TeamOptionalDefaultsSchema, TeamPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateTeamDto
  extends createZodDto(TeamOptionalDefaultsSchema)
  implements Prisma.TeamUncheckedCreateInput {}

export class UpdateTeamDto extends createZodDto(TeamPartialSchema) {}
