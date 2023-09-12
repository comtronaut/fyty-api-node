import type { Appointment, Prisma, Room } from "@prisma/client";

export type ChatMessage = {
  data: Prisma.MessageUncheckedCreateInput & { waitingKey: string };
  waitingKey: string;
};

export type RoomJoin = {
  teamId: string;
  roomId: string;
};

export type RoomLeave = {
  roomParticipantId: string;
};

export type RoomCreate = Room & { appointment: Appointment };

export type RoomDisband = {
  teamId: string;
  roomId: string;
};

export type RoomModify = {
  roomId: string;
  req: Partial<Room & Pick<Appointment, "startAt" | "endAt">>;
};
