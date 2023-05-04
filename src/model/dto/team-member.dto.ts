import { Prisma } from "@prisma/client";

import { TeamMemberOptionalDefaultsSchema, TeamMemberPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateTeamMemberDto
  extends createZodDto(TeamMemberOptionalDefaultsSchema)
  implements Prisma.TeamMemberUncheckedCreateInput {}

export class UpdateTeamMemberDto extends createZodDto(TeamMemberPartialSchema) {}
