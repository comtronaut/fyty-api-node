import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { AdminOptionalDefaultsSchema, AdminSchema, UserSchema } from "model/schema";

export class CreateAdminDto
  extends createZodDto(AdminOptionalDefaultsSchema)
  implements Prisma.AdminUncheckedCreateInput {}

export class UpdateAdminDto extends createZodDto(AdminSchema.partial()) {}

export class SecureAdminDto
  extends createZodDto(
    AdminSchema.omit({
      password: true
    })
  )
  implements Omit<Prisma.AdminUncheckedCreateInput, "password"> {}

export class AdminDetailResponseDto extends createZodDto(
  z.object({
    info: AdminSchema.omit({ password: true }),
    designatedUser: UserSchema.omit({ password: true }).nullable()
  })
) {}
