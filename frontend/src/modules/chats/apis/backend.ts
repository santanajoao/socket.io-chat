import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { GetChatMessagesParams, GetChatMessagesResponse } from "../types/chatMessages";
import { InviteToDirectChatApiBody, InviteToDirectChatApiResponse } from "../types/startNewDirectChat";
import { CreateGroupChatApiBody, CreateGroupChatApiResponse } from "../types/startNewGroupChat";
import { ChatUsersApiResponse, GetChatUsersApiParams } from "../types/getChatUsers";
import { TChatDetails } from "../types/chatDetails";
import { UpdateAdminRightsApiBody, UpdateAdminRightsApiResponse } from "../types/updateAdminRights";
import { RemoveUserFromChatParams } from "../types/removeUserFromChat";

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

async function getChatUsers(data: GetChatUsersApiParams) {
  return treatAxiosRequest<ChatUsersApiResponse>(() => backendChatClient.get(`/${data.chatId}/users`, {
    params: {
      pageSize: data.pageSize,
      cursor: data.cursor,
      search: data.search,
    },
  }));
}

async function getChatDetails(chatId: string) {
  return treatAxiosRequest<TChatDetails>(() => backendChatClient.get(`/${chatId}`));
}

async function updateAdminRights(chatId: string, userId: string, data: UpdateAdminRightsApiBody) {
  return treatAxiosRequest<UpdateAdminRightsApiResponse>(() => backendChatClient.patch(`/${chatId}/users/${userId}/admin`, data));
}

async function removeUserFromChat({ chatId, userId }: RemoveUserFromChatParams) {
  return treatAxiosRequest(() => backendChatClient.delete(`/${chatId}/users/${userId}`));
}

export const backendChatApi = {
  getMessages,
  inviteToDirectChat,
  createGroupChat,
  getChatUsers,
  getChatDetails,
  updateAdminRights,
  removeUserFromChat,
};
