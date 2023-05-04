import { Prisma } from "@prisma/client";

import { TrainingOptionalDefaultsSchema, TrainingPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateTrainingDto
  extends createZodDto(TrainingOptionalDefaultsSchema)
  implements Prisma.TrainingUncheckedCreateInput {}

export class UpdateTrainingDto extends createZodDto(TrainingPartialSchema) {}
