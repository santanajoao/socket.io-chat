import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UsePipes,
} from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { CreateDirectChatBody } from './dtos/create-chat';
import { ChatsService } from './chats.service';
import { AuthenticatedExpressRequest } from 'src/auth/interfaces/jwt.interfaces';
import { CreateGroupChatBody } from './dtos/create-group-chat';
import { UpdateChatGroupBody } from './dtos/update-chat';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateDirectChatSchema } from './schemas/create-direct-chat.schema';
import { CreateGroupChatSchema } from './schemas/create-group-chat.schema';
import { GrandAdminRightsBody } from './dtos/grand-admin-rights';
import { GrantAdminRightsSchema } from './schemas/grant-admin-rights.schema';
import { UpdateChatGroupSchema } from './schemas/update-chat-group.schema';

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
  @UsePipes(new ValidationPipe(CreateDirectChatSchema))
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

  @Post('group')
  @UsePipes(new ValidationPipe(CreateGroupChatSchema))
  async createGroupChat(
    @Request() req: AuthenticatedExpressRequest,
    @Body() body: CreateGroupChatBody,
  ) {
    const result = await this.chatService.createGroupChat({
      ...body,
      userId: req.user.id,
    });

    return {
      data: result.data,
    };
  }

  @Get(':chatId/users')
  async getChatUsers(
    @Param('chatId') chatId: string,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.chatService.getChatUsers({
      chatId,
      cursor,
      pageSize,
      search,
    });

    return {
      data: result.data,
    };
  }

  @Patch(':chatId/users/:userId/admin')
  @UsePipes(new ValidationPipe(GrantAdminRightsSchema))
  async grantAdminRights(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Body() body: GrandAdminRightsBody,
    @Request() req: AuthenticatedExpressRequest,
  ) {
    const result = await this.chatService.updateAdminRights({
      chatId,
      requesterUserId: req.user.id,
      targetUserId: userId,
      isAdmin: body.isAdmin,
    });

    return {
      data: result.data,
    };
  }

  @Delete(':chatId/users/:userId')
  async removeUserFromChat(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Request() req: AuthenticatedExpressRequest,
  ) {
    const result = await this.chatService.removeUserFromChat({
      chatId,
      requesterUserId: req.user.id,
      targetUserId: userId,
    });

    return {
      data: result.data,
    };
  }

  @Get(':chatId')
  async getChatDetails(
    @Request() req: AuthenticatedExpressRequest,
    @Param('chatId') chatId: string,
  ) {
    const result = await this.chatService.getChatDetails({
      chatId,
      userId: req.user.id,
    });

    return {
      data: result.data,
    };
  }

  @Patch(':chatId/group')
  @UsePipes(new ValidationPipe(UpdateChatGroupSchema))
  async updateGroupChat(
    @Request() req: AuthenticatedExpressRequest,
    @Param('chatId') chatId: string,
    @Body() body: UpdateChatGroupBody,
  ) {
    const result = await this.chatService.updateChatGroup({
      chatId,
      userId: req.user.id,
      ...body,
    });

    return {
      data: result.data,
    };
  }

  @Post(':chatId/group/leave')
  async leaveGroupChat(
    @Request() req: AuthenticatedExpressRequest,
    @Param('chatId') chatId: string,
  ) {
    const result = await this.chatService.leaveGroupChat({
      chatId,
      userId: req.user.id,
    });

    return {
      data: result.data,
    };
  }
}
