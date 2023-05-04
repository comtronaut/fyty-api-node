import { Prisma } from ".prisma/client";

import { GameOptionalDefaultsSchema, GamePartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateGameDto
  extends createZodDto(GameOptionalDefaultsSchema)
  implements Prisma.GameUncheckedCreateInput {}

export class UpdateGameDto extends createZodDto(GamePartialSchema) {}
