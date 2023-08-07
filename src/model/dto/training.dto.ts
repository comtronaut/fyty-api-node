import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  AppointmentSchema,
  TrainingOptionalDefaultsSchema,
  TrainingPartialSchema,
  TrainingSchema
} from "model/schema";

export class CreateTrainingDto
  extends createZodDto(TrainingOptionalDefaultsSchema)
  implements Prisma.TrainingUncheckedCreateInput {}

export class UpdateTrainingDto extends createZodDto(TrainingPartialSchema) {}

export class CreateTrainingBypassDto
  extends createZodDto(
    TrainingOptionalDefaultsSchema.extend({
      hostId: z.string(),
      guestId: z.string()
    })
      .merge(
        AppointmentSchema.pick({
          startAt: true,
          endAt: true
        })
      )
      .required({
        hostWinCount: true,
        hostLoseCount: true
      })
      .omit({
        appointmentId: true
      })
  )
  implements Omit<Prisma.TrainingUncheckedCreateInput, "appointmentId"> {}

export class TrainingResponseDto
  extends createZodDto(
    TrainingSchema.extend({
      appointment: AppointmentSchema
    })
  ) {}
