import { WebSocketGateway } from '@nestjs/websockets';
import { FRONTEND_CORS } from 'src/shared/config/cors';
import { AuthenticatedSocket } from 'src/shared/jwt/jwt.interfaces';
import { ChatsService } from './chats.service';

@WebSocketGateway({ namespace: '/chats', cors: FRONTEND_CORS })
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  async handleConnection(socket: AuthenticatedSocket) {
    const userId = socket.request.user.id;

    const chats = await this.chatsService.getAllUserChatIds({ userId });
    if (chats.length > 0) {
      const chatIdList = chats.map((chat) => chat.id);
      await socket.join(chatIdList);
    }
  }
}
