import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { GetChatMessagesParams, GetChatMessagesResponse } from "../types/chatMessages";

export const backendChatClient = backendApi.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/chats`,
});

async function getMessages({ chatId, pageSize, cursor }: GetChatMessagesParams) {
  return treatAxiosRequest<GetChatMessagesResponse>(() => backendChatClient.get(`/${chatId}/messages`, {
    params: {
      pageSize,
      cursor,
    },
  }));
}

export const backendChatApi = {
  getMessages,
};
