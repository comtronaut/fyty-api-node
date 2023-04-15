import { Message, Room } from "@prisma/client";

export type ChatMessage = {
  data: Message;
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
