import { Prisma } from "@prisma/client";

import { UserOptionalDefaultsSchema, UserPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateUserDto
  extends createZodDto(UserOptionalDefaultsSchema)
  implements Prisma.UserUncheckedCreateInput {}

export class UpdateUserDto extends createZodDto(UserPartialSchema) {}
