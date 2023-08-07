import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { AdminOptionalDefaultsSchema, AdminPartialSchema, AdminSchema } from "model/schema";

export class CreateAdminDto
  extends createZodDto(AdminOptionalDefaultsSchema)
  implements Prisma.AdminUncheckedCreateInput {}

export class UpdateAdminDto extends createZodDto(AdminPartialSchema) {}

export class SecureAdminDto
  extends createZodDto(
    AdminSchema.omit({
      password: true
    })
  )
  implements Omit<Prisma.AdminUncheckedCreateInput, "password"> {}
