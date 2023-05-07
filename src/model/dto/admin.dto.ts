import { Prisma } from "@prisma/client";
import { AdminOptionalDefaultsSchema, AdminPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateAdminDto
  extends createZodDto(AdminOptionalDefaultsSchema)
  implements Prisma.AdminUncheckedCreateInput {}

export class UpdateAdminDto extends createZodDto(AdminPartialSchema) {}
