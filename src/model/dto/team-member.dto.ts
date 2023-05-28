import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { TeamMemberOptionalDefaultsSchema, TeamMemberPartialSchema } from "model/schema";

export class CreateTeamMemberDto
  extends createZodDto(TeamMemberOptionalDefaultsSchema)
  implements Prisma.TeamMemberUncheckedCreateInput {}

export class UpdateTeamMemberDto extends createZodDto(TeamMemberPartialSchema) {}
