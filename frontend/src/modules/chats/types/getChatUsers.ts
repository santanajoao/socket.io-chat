
export type ChatUser = {
  id: string;
  username: string;
}

export type ChatUsersApiResponse = {
  users: ChatUser[];
  total: number;
  next?: string;
};

export type GetChatUsersApiParams = {
  chatId: string;
  pageSize: number;
  cursor?: string;
  search?: string;
}