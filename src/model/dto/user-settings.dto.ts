import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import {
  UserSettingsOptionalDefaultsSchema,
  UserSettingsPartialSchema
} from "model/schema";

export class CreateUserSettingsDto
  extends createZodDto(UserSettingsOptionalDefaultsSchema)
  implements Prisma.UserSettingsUncheckedCreateInput {}

export class UpdateUserSettingsDto extends createZodDto(UserSettingsPartialSchema) {}
