import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { GameOptionalDefaultsSchema, GamePartialSchema } from "model/schema";

export class CreateGameDto
  extends createZodDto(GameOptionalDefaultsSchema)
  implements Prisma.GameUncheckedCreateInput {}

export class UpdateGameDto extends createZodDto(GamePartialSchema) {}
