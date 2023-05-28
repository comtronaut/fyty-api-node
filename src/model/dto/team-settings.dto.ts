import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import {
  TeamSettingsOptionalDefaultsSchema,
  TeamSettingsPartialSchema
} from "model/schema";

export class CreateTeamSettingsDto
  extends createZodDto(TeamSettingsOptionalDefaultsSchema)
  implements Prisma.TeamSettingsUncheckedCreateInput {}

export class UpdateTeamSettingsDto extends createZodDto(TeamSettingsPartialSchema) {}
