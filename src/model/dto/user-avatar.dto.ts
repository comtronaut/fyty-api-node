import { Prisma } from "@prisma/client";

import { UserAvatarOptionalDefaultsSchema, UserAvatarPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateUserAvatarDto
  extends createZodDto(UserAvatarOptionalDefaultsSchema)
  implements Prisma.UserAvatarUncheckedCreateInput {}

export class UpdateUserAvatarDto extends createZodDto(UserAvatarPartialSchema) {}
