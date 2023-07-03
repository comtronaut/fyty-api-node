import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  TeamLineupSchema,
  TeamMemberSchema,
  TeamOptionalDefaultsSchema,
  TeamPartialSchema,
  TeamPendingSchema,
  TeamSchema,
  TeamSettingsSchema,
  TeamStatsSchema,
  UserSchema
} from "model/schema";

export class CreateTeamDto
  extends createZodDto(TeamOptionalDefaultsSchema)
  implements Prisma.TeamUncheckedCreateInput {}

export class UpdateTeamDto extends createZodDto(TeamPartialSchema) {}

export class TeamDetailResponseDto extends createZodDto(
  z.object({
    info: TeamSchema,
    settings: TeamSettingsSchema.nullable(),
    stats: TeamStatsSchema.nullable(),
    lineups: TeamLineupSchema.array(),
    members: TeamMemberSchema.array(),
    users: UserSchema.array(),
    pendings: TeamPendingSchema.array()
  })
) {}
