import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly messagesService: MessagesService) {}

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
}
