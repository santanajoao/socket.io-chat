import { Controller, Get, ParseIntPipe, Query, Request } from '@nestjs/common';
import { ChatsService } from 'src/chats/chats.service';
import { AuthenticatedExpressRequest } from 'src/auth/interfaces/jwt.interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('chats')
  async getUserChats(
    @Request() req: AuthenticatedExpressRequest,
    @Query('cursor') cursor: string,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const result = await this.chatsService.getUserPaginatedChatList({
      userId: req.user?.id,
      cursor,
      pageSize,
    });

    return {
      data: result.data,
    };
  }
}
