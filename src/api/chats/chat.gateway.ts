import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { CreateMessageDto } from "src/model/dto/chat.dto";
import { Chat } from "src/model/sql-entity/chat.entity";
import { ChatService } from "./chat.service";
import { MessageService } from "./messages/message.service";
  
  @WebSocketGateway({
    cors: {
      origin: "*"
    }
  })
  
export class AppGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private messageService: MessageService) {}
  
  @WebSocketServer() server: Server;

  @SubscribeMessage("sendMessage")
  async handleSendMessage(client: Socket, payload: CreateMessageDto): Promise<void> {
    await this.messageService.create(payload);
    this.server.emit(`recMessage ${payload.chatId}`, payload);
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
