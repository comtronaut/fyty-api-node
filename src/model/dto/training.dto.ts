import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { TrainingOptionalDefaultsSchema, TrainingPartialSchema } from "model/schema";

export class CreateTrainingDto
  extends createZodDto(TrainingOptionalDefaultsSchema)
  implements Prisma.TrainingUncheckedCreateInput {}

export class UpdateTrainingDto extends createZodDto(TrainingPartialSchema) {}
