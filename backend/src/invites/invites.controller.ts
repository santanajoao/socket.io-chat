import { Controller, Get, Request } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AuthenticatedExpressRequest } from 'src/auth/interfaces/jwt.interfaces';

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
}
