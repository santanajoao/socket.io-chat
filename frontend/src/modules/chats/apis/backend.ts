import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { GetChatMessagesParams, GetChatMessagesResponse } from "../types/chatMessages";
import { CreateDirectChatApiBody, CreateDirectChatApiResponse } from "../types/startNewDirectChat";

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

async function createDirectChat(data: CreateDirectChatApiBody) {
  return treatAxiosRequest<CreateDirectChatApiResponse>(() => backendChatClient.post('/direct', data));
}

export const backendChatApi = {
  getMessages,
  createDirectChat,
};
