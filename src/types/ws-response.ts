import type { Message, Room, RoomMember } from "@prisma/client";

export type ChatMessage = {
  data: Message;
  waitingKey: string;
};

export type RoomJoin = {
  teamId: string;
  roomId: string;
};

export type RoomLeave = {
  roomParticipant: RoomMember;
};

export type RoomCreate = {
  room: Room;
};

export type RoomDisbandGlobal = {
  roomId: Room["id"];
};

export type RoomDisband = {
  roomId: Room["id"];
};

export type RoomModify = {
  room: Partial<Room>;
};
