import { Prisma, UserSettings } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { UserSettingsOptionalDefaultsSchema, UserSettingsSchema } from "model/schema";

export class UserSettingsDto
  extends createZodDto(UserSettingsSchema)
  implements UserSettings {}

export class CreateUserSettingsDto
  extends createZodDto(UserSettingsOptionalDefaultsSchema)
  implements Prisma.UserSettingsUncheckedCreateInput {}

export class UpdateUserSettingsDto extends createZodDto(UserSettingsSchema.partial()) {}
