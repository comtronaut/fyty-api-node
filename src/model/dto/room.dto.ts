import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { RoomOptionalDefaultsSchema, RoomPartialSchema, RoomPendingSchema, RoomSchema, TeamSchema } from "model/schema";

export class CreateRoomDto
  extends createZodDto(
    RoomOptionalDefaultsSchema.extend({
      teamLineupIds: z.string().cuid().array()
    })
  )
  implements Prisma.RoomUncheckedCreateInput {}

export class UpdateRoomDto extends createZodDto(RoomPartialSchema) {}

export class DeleteRoomDto extends createZodDto(
  z.object({
    roomId: z.string().cuid(),
    teamId: z.string().cuid()
  })
) {}

export class LobbyDetailResponseDto extends createZodDto(
  z.object({
    rooms: RoomSchema.array(),
    userGameTeams: TeamSchema.array(),
    hostedRoomIds: z.string().cuid().array(),
    joinedRoomIds: z.string().cuid().array(),
    pendingRoomIds: z.string().cuid().array(),
    roomPendings: RoomPendingSchema.array()
  })
) {

}
