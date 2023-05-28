import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { PasswordResetSessionPartialSchema } from "model/schema";
import { PasswordResetSessionOptionalDefaultsSchema } from "model/schema";

export class CreatePasswordResetSessionDto
  extends createZodDto(PasswordResetSessionOptionalDefaultsSchema)
  implements Prisma.PasswordResetSessionUncheckedCreateInput {}

export class UpdatePasswordResetSessionDto extends createZodDto(
  PasswordResetSessionPartialSchema
) {}
