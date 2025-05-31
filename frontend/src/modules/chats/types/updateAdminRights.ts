export type UpdateAdminRightsApiBody = {
  isAdmin: boolean;
}

export type UpdateAdminRightsApiResponse = {
  chatId: string;
  userId: string;
  isAdmin: boolean;
}

export type OnAdminRightUpdateBody = UpdateAdminRightsApiResponse;