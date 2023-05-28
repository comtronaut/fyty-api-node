import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { AdminOptionalDefaultsSchema, AdminPartialSchema } from "model/schema";

export class CreateAdminDto
  extends createZodDto(AdminOptionalDefaultsSchema)
  implements Prisma.AdminUncheckedCreateInput {}

export class UpdateAdminDto extends createZodDto(AdminPartialSchema) {}
