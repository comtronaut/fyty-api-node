import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { UserAvatarOptionalDefaultsSchema, UserAvatarSchema } from "model/schema";

export class UserAvatarDto extends createZodDto(UserAvatarSchema) {}

export class CreateUserAvatarDto
  extends createZodDto(UserAvatarOptionalDefaultsSchema)
  implements Prisma.UserAvatarUncheckedCreateInput {}

export class UpdateUserAvatarDto extends createZodDto(UserAvatarSchema.partial()) {}
