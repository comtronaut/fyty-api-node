import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { UserRecoverySessionSchema } from "model/schema";
import { UserRecoverySessionOptionalDefaultsSchema } from "model/schema";

export class CreateUserRecoverySessionDto
  extends createZodDto(UserRecoverySessionOptionalDefaultsSchema)
  implements Prisma.UserRecoverySessionUncheckedCreateInput {}

export class UpdateUserRecoverySessionDto extends createZodDto(
  UserRecoverySessionSchema.partial()
) {}
