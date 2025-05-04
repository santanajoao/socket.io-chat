import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { FRONTEND_CORS } from 'src/shared/config/cors';
import { AuthenticatedSocket } from 'src/auth/interfaces/jwt.interfaces';
import { ChatsService } from './chats.service';
import { MessagesService } from 'src/messages/messages.service';
import { Namespace } from 'socket.io';

@WebSocketGateway({ namespace: '/chats', cors: FRONTEND_CORS })
export class ChatsGateway {
  @WebSocketServer()
  server: Namespace;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: MessagesService,
  ) {}

  async handleConnection(socket: AuthenticatedSocket) {
    const userId = socket.request.user.id;
    const chats = await this.chatsService.getAllUserChatIds({ userId });
    if (chats.length > 0) {
      const chatIdList = chats.map((chat) => chat.id);
      await socket.join(chatIdList);
    }
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { chatId: string; content: string },
  ) {
    const result = await this.messageService.createMessage({
      chatId: payload.chatId,
      userId: socket.request.user.id,
      content: payload.content,
    });

    this.server.to(payload.chatId).emit('message:receive', {
      chatId: payload.chatId,
      message: result.data,
    });
  }
}
