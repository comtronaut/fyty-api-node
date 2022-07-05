import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from "@nestjs/websockets";
  import { Socket, Server } from "socket.io";
  import { CreateRoomDto } from "src/model/dto/room.dto";
  import { RoomService } from "./room.service";

    
    @WebSocketGateway({
      cors: {
        origin: "*"
      }
    })
    
  export class RoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private roomService: RoomService) {}
    
    @WebSocketServer() server: Server;
  
    @SubscribeMessage("room/create")  // done maybe :)
    async createRoom(client: Socket, payload: CreateRoomDto): Promise<void> {
      const res = await this.roomService.create(payload);
      this.server.emit(`res/room/create`, res);
    }

    @SubscribeMessage("room/join")
    async joinRoom(client: Socket, payload: any): Promise<void> {
      const res = await this.roomService.joinRoom(payload);
      this.server.emit(`res/room/${ payload.roomId }/join`, res);
    }

    @SubscribeMessage("room/disband")
    async disbandRoom(client: Socket, payload: any): Promise<void> {
      const res = await this.roomService.disband(payload);
      this.server.emit(`res/room/${ payload.roomId }/disband`, res);
    }

    @SubscribeMessage("room/leave")
    async leaveRoom(client: Socket, payload: any): Promise<void> {
      const res = await this.roomService.leaveRoom(payload);
      this.server.emit(`res/room/${ res.roomId }/leave`, res.res);
    }

    @SubscribeMessage("room/modify")
    async modifyRoom(client: Socket, payload: any): Promise<void> {
      const res = await this.roomService.update(payload.roomId, payload.req);
      this.server.emit(`res/room/${ payload.roomId }/modify`, res);
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
  