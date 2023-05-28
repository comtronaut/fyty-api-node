import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { UserOptionalDefaultsSchema, UserPartialSchema } from "model/schema";

export class CreateUserDto
  extends createZodDto(UserOptionalDefaultsSchema)
  implements Prisma.UserUncheckedCreateInput {}

export class UpdateUserDto extends createZodDto(UserPartialSchema) {}
