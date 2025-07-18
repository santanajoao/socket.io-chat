
export type ChatUser = {
  id: string;
  username: string;
  isAdmin: boolean;
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