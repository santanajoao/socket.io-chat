import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UsePipes,
} from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AuthenticatedExpressRequest } from 'src/auth/interfaces/jwt.interfaces';
import { CreateGroupInviteBody } from './dto/create-group-invite';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateGroupInviteSchema } from './schemas/create-group-invite.schema';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Get('/')
  async getAllInvites(
    @Request() req: AuthenticatedExpressRequest,
    @Query('cursor') cursor?: string,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
  ) {
    const result = await this.invitesService.getAllUserInvites({
      userId: req.user.id,
      cursor,
      pageSize,
    });

    return {
      data: result.data,
    };
  }

  @Post('/group')
  @UsePipes(new ValidationPipe(CreateGroupInviteSchema))
  async createGroupInvite(
    @Request() req: AuthenticatedExpressRequest,
    @Body() body: CreateGroupInviteBody,
  ) {
    const result = await this.invitesService.createGroupInvite({
      receiverEmail: body.email,
      chatId: body.chatId,
      senderUserId: req.user.id,
    });

    return {
      data: result.data,
    };
  }
}
