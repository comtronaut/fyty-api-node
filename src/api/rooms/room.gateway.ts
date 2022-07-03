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
  
    @SubscribeMessage("room/create")
    async createRoom(client: Socket, payload: CreateRoomDto): Promise<void> {
      await this.roomService.create(payload);
      this.server.emit(`res/room/create`, payload);
    }

    @SubscribeMessage("join/create")
    async joinRoom(client: Socket, payload: string): Promise<void> {
      await this.roomService.joinRoom(payload);
      this.server.emit(`res/room/${ payload }/join`, payload);
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
  