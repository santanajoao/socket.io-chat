export class AddUsersToChatRepositoryParams {
  data: {
    chatId: string;
    userId: string;
    isAdmin?: boolean;
  }[];
}
