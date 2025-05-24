import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AuthenticatedExpressRequest } from 'src/auth/interfaces/jwt.interfaces';
import { CreateGroupInviteBody } from './dto/create-group-invite';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Get('/')
  async getAllInvites(@Request() req: AuthenticatedExpressRequest) {
    const result = await this.invitesService.getAllUserInvites(req.user.id);

    return {
      data: result.data,
    };
  }

  @Post('/group')
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
