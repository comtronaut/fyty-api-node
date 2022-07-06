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
  
export class ChatGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private messageService: MessageService) {}
  
  @WebSocketServer() server: Server;

  @SubscribeMessage("message")
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    await this.messageService.create(payload.data);
    this.server.emit(`res/chat/${payload.data.chatId}`, payload);
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
