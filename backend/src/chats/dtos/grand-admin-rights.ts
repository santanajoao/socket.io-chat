export class UpdateAdminRightsServiceDto {
  chatId: string;
  requesterUserId: string;
  targetUserId: string;
  isAdmin: boolean;
}

export class OnAdminRightUpdateBody {
  chatId: string;
  userId: string;
  isAdmin: boolean;
}

export class GrandAdminRightsBody {
  isAdmin: boolean;
}
