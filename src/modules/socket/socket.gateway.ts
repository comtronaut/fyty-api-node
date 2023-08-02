import { OnEvent } from "@nestjs/event-emitter";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { CreateRoomDto } from "model/dto/room.dto";
import type * as WSPayloadType from "types/ws-payload";
import { RoomDisband, RoomJoin, RoomLeave, RoomModify } from "types/ws-payload";

import { MessageService } from "../chat/message.service";
import { RoomService } from "../room/room.service";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class SocketGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server?: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService
  ) {}

  afterInit(server: Server) {
    console.log("server start");
    this.server = server;
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }

  @OnEvent("socket.room-system-removal")
  handleRoomSystemRemoval(payload: { roomId: string }) {
    this.server?.emit(`res/room/${payload.roomId}/disband`, {
      ...payload,
      isManual: false
    });
  }

  @OnEvent("socket.notification-room-message")
  handleChatMessage(payload: { receiverUserId: string; message: string }) {
    this.server?.emit(`res/notification/${payload.receiverUserId}/disband`, {
      receiverUserId: payload.receiverUserId
    });
  }

  // message
  @SubscribeMessage("message")
  async handleSendMessage(
    client: Socket,
    payload: WSPayloadType.ChatMessage
  ): Promise<void> {
    const createdMessage = await this.messageService.create(payload.data as any);
    this.server?.emit(`res/chat/${payload.data.chatId}`, {
      data: createdMessage,
      waitingKey: payload.waitingKey
    });
  }

  // rooms
  @SubscribeMessage("room/create")
  async createRoom(client: Socket, payload: CreateRoomDto): Promise<void> {
    const room = await this.roomService.create(payload);
    this.server?.emit("res/room/create", { room });
  }

  @SubscribeMessage("room/join")
  async joinRoom(client: Socket, payload: RoomJoin): Promise<void> {
    const res = await this.roomService.acceptRoomRequest(payload);
    this.server?.emit(`res/room/${payload.roomId}/join`, res);
  }

  @SubscribeMessage("room/disband")
  async disbandRoom(client: Socket, payload: RoomDisband): Promise<void> {
    const res = await this.roomService.disband(payload);
    this.server?.emit("res/room/disband", res);
    this.server?.emit(`res/room/${payload.roomId}/disband`, {
      ...res,
      isManual: true
    });
  }

  @SubscribeMessage("room/leave")
  async leaveRoom(client: Socket, payload: RoomLeave): Promise<void> {
    const res = await this.roomService.leaveRoom(payload.roomParticipantId);
    this.server?.emit(`res/room/${res.roomId}/leave`, res.res);
  }

  @SubscribeMessage("room/modify")
  async modifyRoom(client: Socket, payload: RoomModify): Promise<void> {
    const room = await this.roomService.update(payload.roomId, payload.req);
    this.server?.emit(`res/room/${payload.roomId}/modify`, { room });
  }
}
