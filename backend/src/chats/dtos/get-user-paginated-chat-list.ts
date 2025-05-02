export class GetUserPaginatedChatListRepositoryParams {
  userId: string;
  cursor?: string;
  limit: number;
}

export class GetUserPaginatedChatListServiceParams {
  userId: string;
  cursor?: string;
  pageSize: number;
}

class Chat {
  id: string;
  type: string;
}

export class GetUserPaginatedChatListResponse {
  chats: Chat[];
  total: number;
}
