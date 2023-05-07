import { Prisma } from "@prisma/client";
import {
  TrainingReportOptionalDefaultsSchema,
  TrainingReportPartialSchema
} from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateTrainingReportDto
  extends createZodDto(TrainingReportOptionalDefaultsSchema)
  implements Prisma.TrainingReportUncheckedCreateInput {}

export class UpdateTrainingReportDto extends createZodDto(TrainingReportPartialSchema) {}
