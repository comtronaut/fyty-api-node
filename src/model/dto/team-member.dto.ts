import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { TeamMemberOptionalDefaultsSchema, TeamMemberSchema } from "model/schema";

export class CreateTeamMemberDto
  extends createZodDto(TeamMemberOptionalDefaultsSchema)
  implements Prisma.TeamMemberUncheckedCreateInput {}

export class UpdateTeamMemberDto extends createZodDto(TeamMemberSchema.partial()) {}
