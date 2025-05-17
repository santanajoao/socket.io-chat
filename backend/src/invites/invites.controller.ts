import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { RespondInviteRequestBody } from './dto/respond-invite';
import { InvitesService } from './invites.service';
import { AuthenticatedExpressRequest } from 'src/auth/interfaces/jwt.interfaces';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post(':inviteId/respond')
  async respondInvite(
    @Request() req: AuthenticatedExpressRequest,
    @Param('inviteId') inviteId: string,
    @Body() body: RespondInviteRequestBody,
  ) {
    const result = await this.invitesService.respondInvite({
      ...body,
      inviteId,
      userId: req.user.id,
    });

    return {
      data: result.data,
    };
  }

  @Get('/')
  async getAllInvites(@Request() req: AuthenticatedExpressRequest) {
    const result = await this.invitesService.getAllUserInvites(req.user.id);

    return {
      data: result.data,
    };
  }
}
