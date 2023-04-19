import type {
  Appointment,
  Room,
  RoomPending,
  Team,
  TeamLineup,
  TeamMember,
  TeamPending,
  TeamSettings,
  TeamStats,
  User
} from "@prisma/client";
import type { Nullable } from "tsdef";

export type TeamDetail = {
  info: Team;
  settings: Nullable<TeamSettings>;
  stats: Nullable<TeamStats>;
  lineups: TeamLineup[];
  members: TeamMember[];
  users: User[];
  pendings: TeamPending[];
};

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
