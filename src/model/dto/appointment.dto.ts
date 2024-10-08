import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  AppointmentOptionalDefaultsSchema,
  AppointmentSchema,
  TeamSchema
} from "model/schema";

export class CreateAppointmentDto
  extends createZodDto(
    AppointmentOptionalDefaultsSchema.extend({
      teamIds: z.string().array().nonempty()
    })
  )
  implements Prisma.AppointmentUncheckedCreateInput {}

export class UpdateAppointmentDto extends createZodDto(
  AppointmentSchema.partial().pick({
    startAt: true,
    endAt: true
  })
) {}

export class AppointmentPackResponseDto extends createZodDto(
  z.object({
    appointment: AppointmentSchema,
    team: TeamSchema.nullable()
  })
) {}
