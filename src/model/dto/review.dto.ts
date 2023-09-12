import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { ReviewOptionalDefaultsSchema, ReviewSchema } from "model/schema";

export class CreateReviewDto
  extends createZodDto(ReviewOptionalDefaultsSchema)
  implements Prisma.ReviewUncheckedCreateInput {}

export class UpdateReviewDto extends createZodDto(ReviewSchema.partial()) {}
