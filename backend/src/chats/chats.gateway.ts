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
import { RespondInviteRequestBody } from 'src/invites/dto/respond-invite';
import { InvitesService } from 'src/invites/invites.service';

@WebSocketGateway({ namespace: CHAT_NAMESPACE, cors: FRONTEND_CORS })
export class ChatsGateway {
  @WebSocketServer()
  namespace: Namespace;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: MessagesService,
    private readonly invitesService: InvitesService,
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

  @SubscribeMessage('chat:join')
  async joinChat(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() { chatId }: { chatId: string },
  ) {
    const result = await this.chatsService.authorizeJoinChat({
      chatId,
      userId: socket.request.user.id,
    });

    if (result.data.authorized) {
      await socket.join(chatId);
    }
  }

  @SubscribeMessage(CHAT_EVENTS.INVITE_RESPONSE)
  async respondInvite(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: RespondInviteRequestBody,
  ) {
    const result = await this.invitesService.respondInvite({
      accept: body.accept,
      inviteId: body.inviteId,
      userId: socket.request.user.id,
    });

    const usersRooms = [
      result.data.invite.senderUserId,
      result.data.invite.receiverUserId,
    ];

    this.namespace
      .to(usersRooms)
      .emit(CHAT_EVENTS.INVITE_RESPONSE, result.data.invite);

    this.namespace
      .to(usersRooms)
      .emit(CHAT_EVENTS.CREATED_CHAT, result.data.chat);
  }

  @OnEvent(CHAT_EVENTS.CREATED_DIRECT_CHAT)
  onDirectChatCreation(body: OnDirectChatCreationBody) {
    this.namespace.to(body.receiverUser.id).emit('chat:invite', body.invite);
  }
}
