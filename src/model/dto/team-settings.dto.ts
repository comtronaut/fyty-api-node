import { createZodDto } from "nestjs-zod";

import { TeamSettingsSchema } from "model/schema";

export class UpdateTeamSettingsDto extends createZodDto(TeamSettingsSchema.partial()) {}
