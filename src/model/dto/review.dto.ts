import { Prisma } from "@prisma/client";

import { ReviewOptionalDefaultsSchema, ReviewPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateReviewDto
  extends createZodDto(ReviewOptionalDefaultsSchema)
  implements Prisma.ReviewUncheckedCreateInput {}

export class UpdateReviewDto extends createZodDto(ReviewPartialSchema) {}
