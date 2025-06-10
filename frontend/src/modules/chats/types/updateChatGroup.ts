export type UpdateChatGroupBody = {
  title: string;
}

export type OnChatGroupUpdate = {
  chatId: string;
  group: {
    id: string;
    title: string;
  }
}
