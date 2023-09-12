import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  AppointmentSchema,
  RoomMemberSchema,
  RoomOptionalDefaultsSchema,
  RoomPendingSchema,
  RoomSchema,
  TeamSchema
} from "model/schema";

export class CreateRoomDto
  extends createZodDto(
    RoomOptionalDefaultsSchema.extend({
      teamLineupIds: z.string().cuid().array(),
      startAt: z.coerce.date(),
      endAt: z.coerce.date()
    })
  )
  implements Prisma.RoomUncheckedCreateInput {}

export class UpdateRoomDto extends createZodDto(
  RoomSchema.extend({
    startAt: z.coerce.date(),
    endAt: z.coerce.date()
  }).partial()
) {}

export class DeleteRoomDto extends createZodDto(
  z.object({
    roomId: z.string().cuid(),
    teamId: z.string().cuid()
  })
) {}

export class LobbyForUserResponseDto extends createZodDto(
  z.object({
    userGameTeams: TeamSchema.array(),
    hostedRoomIds: z.string().cuid().array(),
    joinedRoomIds: z.string().cuid().array(),
    requestingPendings: RoomPendingSchema.array(),
    hostingPendings: RoomPendingSchema.array()
  })
) {}

export class EventLobbyDetailResponseDto extends createZodDto(
  z.object({
    rooms: RoomSchema.extend({
      appointment: AppointmentSchema,
      members: RoomMemberSchema.array()
    }).array(),
    userGameTeams: TeamSchema.array(),
    hostedRoomIds: z.string().cuid().array(),
    joinedRoomIds: z.string().cuid().array(),
    pendingRoomIds: z.string().cuid().array(),
    roomPendings: RoomPendingSchema.array()
  })
) {}
