import { Prisma } from ".prisma/client";

import { AppointmentOptionalDefaultsSchema, AppointmentPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class CreateAppointmentDto
  extends createZodDto(
    AppointmentOptionalDefaultsSchema.merge(
      z.object({
        teamIds: z.string().array().nonempty()
      })
    )
  )
  implements Prisma.AppointmentUncheckedCreateInput {}

export class UpdateAppointmentDto extends createZodDto(
  AppointmentPartialSchema.pick({
    startAt: true,
    endAt: true
  })
) {}
