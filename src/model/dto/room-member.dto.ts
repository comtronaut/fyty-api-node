import { Prisma } from "@prisma/client";

import { RoomMemberOptionalDefaultsSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateRoomMemberDto
  extends createZodDto(RoomMemberOptionalDefaultsSchema)
  implements Prisma.RoomMemberUncheckedCreateInput {}
