import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { CreateDirectChatBody } from './dtos/create-chat';
import { ChatsService } from './chats.service';
import { AuthenticatedExpressRequest } from 'src/auth/interfaces/jwt.interfaces';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Get(':chatId/messages')
  async getChatMessages(
    @Param('chatId') chatId: string,
    @Query('cursor') cursor: string,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const result = await this.messagesService.getChatMessages({
      chatId,
      cursor,
      pageSize,
    });

    return {
      data: result.data,
    };
  }

  @Post('direct')
  async createDirectChat(
    @Body() body: CreateDirectChatBody,
    @Request() req: AuthenticatedExpressRequest,
  ) {
    const result = await this.chatService.createDirectChat({
      receiverEmail: body.receiverEmail,
      senderId: req.user.id,
    });

    return {
      data: result.data.invite,
    };
  }
}
