import { createZodDto } from "nestjs-zod";

import { TeamSettingsPartialSchema } from "model/schema";

export class UpdateTeamSettingsDto extends createZodDto(TeamSettingsPartialSchema) {}
