import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { GetChatMessagesParams, GetChatMessagesResponse } from "../types/chatMessages";
import { InviteToDirectChatApiBody, InviteToDirectChatApiResponse } from "../types/startNewDirectChat";
import { CreateGroupChatApiBody, CreateGroupChatApiResponse } from "../types/startNewGroupChat";
import { InviteToGroupChatApiBody } from "../types/inviteToGroupChat";

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

async function inviteToDirectChat(data: InviteToDirectChatApiBody) {
  return treatAxiosRequest<InviteToDirectChatApiResponse>(() => backendChatClient.post('/direct', data));
}

async function createGroupChat(data: CreateGroupChatApiBody) {
  return treatAxiosRequest<CreateGroupChatApiResponse>(() => backendChatClient.post('/group', data));
}

export const backendChatApi = {
  getMessages,
  inviteToDirectChat,
  createGroupChat,
};
