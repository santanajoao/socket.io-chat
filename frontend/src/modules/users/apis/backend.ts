import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { GetUserChatsParams, GetUserChatsResponse } from "../types/user-chats";

const userClient = backendApi.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
});

async function getUserChats({ pageSize, cursor }: GetUserChatsParams) {
  return treatAxiosRequest<GetUserChatsResponse>(() => userClient.get('/chats', {
    params: {
      pageSize,
      cursor,
    },
  }));
}

async function markChatMessagesAsRead(chatId: string) {
  return treatAxiosRequest<GetUserChatsResponse>(() => userClient.post(`/chats/${chatId}/read`));
}

export const backendUserApi = {
  getUserChats,
  markChatMessagesAsRead,
};
