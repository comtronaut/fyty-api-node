import { Prisma } from "@prisma/client";

import { PasswordResetSessionPartialSchema } from "model/schema";
import { PasswordResetSessionOptionalDefaultsSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreatePasswordResetSessionDto
  extends createZodDto(PasswordResetSessionOptionalDefaultsSchema)
  implements Prisma.PasswordResetSessionUncheckedCreateInput {}

export class UpdatePasswordResetSessionDto extends createZodDto(
  PasswordResetSessionPartialSchema
) {}
