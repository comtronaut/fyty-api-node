import type { Appointment, Room, RoomPending, Team } from "@prisma/client";
import type { Nullable } from "tsdef";

export type LobbyDetail = {
  rooms: Room[];
  userGameTeams: Team[];
  hostedRoomIds: string[];
  joinedRoomIds: string[];
  pendingRoomIds: string[];
  roomPendings: RoomPending[];
};

export type AppointmentPack = {
  appointment: Appointment;
  team: Nullable<Team>;
};
