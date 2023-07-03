import { Prisma, UserAvatar } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import {
  UserAvatarOptionalDefaultsSchema,
  UserAvatarPartialSchema,
  UserAvatarSchema
} from "model/schema";

export class UserAvatarDto
  extends createZodDto(UserAvatarSchema)
  implements Omit<UserAvatar, "ratingScore"> {}

export class CreateUserAvatarDto
  extends createZodDto(UserAvatarOptionalDefaultsSchema)
  implements Prisma.UserAvatarUncheckedCreateInput {}

export class UpdateUserAvatarDto extends createZodDto(UserAvatarPartialSchema) {}
