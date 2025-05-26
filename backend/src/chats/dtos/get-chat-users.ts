export class GetChatUsersServiceParams {
  chatId: string;
  cursor?: string;
  pageSize: number;
  search?: string;
}

export class GetChatUsersPaginatedRepositoryParams {
  chatId: string;
  cursor?: string;
  pageSize: number;
  search?: string;
}
