import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { UserRecoverySessionPartialSchema } from "model/schema";
import { UserRecoverySessionOptionalDefaultsSchema } from "model/schema";

export class CreateUserRecoverySessionDto
  extends createZodDto(UserRecoverySessionOptionalDefaultsSchema)
  implements Prisma.UserRecoverySessionUncheckedCreateInput {}

export class UpdateUserRecoverySessionDto extends createZodDto(
  UserRecoverySessionPartialSchema
) {}
