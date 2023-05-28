import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import {
  TrainingReportOptionalDefaultsSchema,
  TrainingReportPartialSchema
} from "model/schema";

export class CreateTrainingReportDto
  extends createZodDto(TrainingReportOptionalDefaultsSchema)
  implements Prisma.TrainingReportUncheckedCreateInput {}

export class UpdateTrainingReportDto extends createZodDto(TrainingReportPartialSchema) {}
