import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import { RoomMemberOptionalDefaultsSchema } from "model/schema";

export class CreateRoomMemberDto
  extends createZodDto(RoomMemberOptionalDefaultsSchema)
  implements Prisma.RoomMemberUncheckedCreateInput {}
