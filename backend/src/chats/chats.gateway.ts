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
import { OnEvent } from '@nestjs/event-emitter';
import { CHAT_NAMESPACE } from './constants/namespaces';
import { CHAT_EVENTS } from './constants/events';
import { OnDirectChatCreationBody } from './dtos/create-chat';
import { OnInviteResponseBody } from 'src/invites/dto/respond-invite';

// criar tipos para payloads

@WebSocketGateway({ namespace: CHAT_NAMESPACE, cors: FRONTEND_CORS })
export class ChatsGateway {
  @WebSocketServer()
  namespace: Namespace;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: MessagesService,
  ) {}

  async handleConnection(socket: AuthenticatedSocket) {
    const userId = socket.request.user.id;
    await socket.join(userId);

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

    this.namespace.to(payload.chatId).emit('message:receive', {
      chatId: payload.chatId,
      message: result.data,
    });
  }

  @OnEvent(CHAT_EVENTS.CREATED_DIRECT_CHAT)
  onDirectChatCreation(body: OnDirectChatCreationBody) {
    this.namespace.to(body.receiverUser.id).emit('chat:invite', body.invite);
  }

  @OnEvent(CHAT_EVENTS.INVITE_RESPONSE)
  onInviteResponse(body: OnInviteResponseBody) {
    this.namespace
      .to(body.senderUserId)
      .emit(CHAT_EVENTS.INVITE_RESPONSE, body);
  }
}
