import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { UserAvatarOptionalDefaultsSchema, UserAvatarPartialSchema } from "model/schema";

export class CreateUserAvatarDto
  extends createZodDto(UserAvatarOptionalDefaultsSchema)
  implements Prisma.UserAvatarUncheckedCreateInput {}

export class UpdateUserAvatarDto extends createZodDto(UserAvatarPartialSchema) {}
