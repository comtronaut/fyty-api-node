import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

import { CreateRoomDto } from "model/dto/room.dto";
import { RoomJoin, RoomDisband, RoomLeave, RoomModify } from "types/ws-payload";
import type * as WSPayloadType from "types/ws-payload";

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
  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService
  ) {}

  @WebSocketServer() server: Server;

  // message
  @SubscribeMessage("message")
  async handleSendMessage(
    client: Socket,
    payload: WSPayloadType.ChatMessage
  ): Promise<void> {
    const createdMessage = await this.messageService.create(payload.data as any);
    this.server.emit(`res/chat/${payload.data.chatId}`, {
      data: createdMessage,
      waitingKey: payload.waitingKey
    });
  }

  // rooms
  @SubscribeMessage("room/create")
  async createRoom(client: Socket, payload: CreateRoomDto): Promise<void> {
    const room = await this.roomService.create(payload);
    this.server.emit("res/room/create", { room });
  }

  @SubscribeMessage("room/join")
  async joinRoom(client: Socket, payload: RoomJoin): Promise<void> {
    const res = await this.roomService.acceptRoomRequest(payload);
    this.server.emit(`res/room/${payload.roomId}/join`, res);
  }

  @SubscribeMessage("room/disband")
  async disbandRoom(client: Socket, payload: RoomDisband): Promise<void> {
    const res = await this.roomService.disband(payload);
    this.server.emit("res/room/disband", res);
    this.server.emit(`res/room/${payload.roomId}/disband`, res);
  }

  @SubscribeMessage("room/leave")
  async leaveRoom(client: Socket, payload: RoomLeave): Promise<void> {
    const res = await this.roomService.leaveRoom(payload.roomParticipantId);
    this.server.emit(`res/room/${res.roomId}/leave`, res.res);
  }

  @SubscribeMessage("room/modify")
  async modifyRoom(client: Socket, payload: RoomModify): Promise<void> {
    const room = await this.roomService.update(payload.roomId, payload.req);
    this.server.emit(`res/room/${payload.roomId}/modify`, { room });
  }

  afterInit(server: Server) {
    console.log("server start");
    // console.log(server);
    // Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    // Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    // Do stuffs
  }
}
