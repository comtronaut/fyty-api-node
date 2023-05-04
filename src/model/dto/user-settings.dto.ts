import { Prisma } from "@prisma/client";
import {
  UserSettingsOptionalDefaultsSchema,
  UserSettingsPartialSchema
} from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateUserSettingsDto
  extends createZodDto(UserSettingsOptionalDefaultsSchema)
  implements Prisma.UserSettingsUncheckedCreateInput {}

export class UpdateUserSettingsDto extends createZodDto(UserSettingsPartialSchema) {}
