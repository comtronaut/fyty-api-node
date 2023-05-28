import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { ReviewOptionalDefaultsSchema, ReviewPartialSchema } from "model/schema";

export class CreateReviewDto
  extends createZodDto(ReviewOptionalDefaultsSchema)
  implements Prisma.ReviewUncheckedCreateInput {}

export class UpdateReviewDto extends createZodDto(ReviewPartialSchema) {}
