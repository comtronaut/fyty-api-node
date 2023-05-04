import { Prisma } from "@prisma/client";

import {
  TeamSettingsOptionalDefaultsSchema,
  TeamSettingsPartialSchema
} from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateTeamSettingsDto
  extends createZodDto(TeamSettingsOptionalDefaultsSchema)
  implements Prisma.TeamSettingsUncheckedCreateInput {}

export class UpdateTeamSettingsDto extends createZodDto(TeamSettingsPartialSchema) {}
