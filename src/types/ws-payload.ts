import type { Prisma, Room } from "@prisma/client";

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

export type RoomCreate = Partial<Room>;

export type RoomDisband = {
  teamId: string;
  roomId: string;
};

export type RoomModify = {
  roomId: string;
  req: Partial<Room>;
};
