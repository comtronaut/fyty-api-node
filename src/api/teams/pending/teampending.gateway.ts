import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { TeampendingService } from "./teampending.service";
  
  @WebSocketGateway({
    cors: {
      origin: "*"
    }
  })
  
export class TeamGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private teampendingService: TeampendingService) {}
  
  @WebSocketServer() server: Server;

  @SubscribeMessage("message")
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    await this.teampendingService.create(payload.data);
    this.server.emit(`res/team/${payload.data.teamId}`, payload);
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
