import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { MessageService } from "./message.service";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class ChatGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messageService: MessageService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage("message")
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    const createdMessage = await this.messageService.create(payload.data);

    this.server.emit(`res/chat/${payload.data.chatId}`, {
      data: createdMessage,
      waitingKey: payload.waitingKey
    });
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
