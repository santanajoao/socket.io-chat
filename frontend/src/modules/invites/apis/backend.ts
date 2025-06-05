import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { GetUserInviteResponse, GetUserInviteParams } from "../types/user-invites";
import { InviteToGroupChatApiBody, InviteToGroupChatApiResponse } from "@/modules/chats/types/inviteToGroupChat";

const inviteClient = backendApi.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/invites`,
});

async function getUserInvites({ cursor, pageSize }: GetUserInviteParams = {}) {
  return treatAxiosRequest<GetUserInviteResponse>(() => inviteClient.get('/', {
    params: {
      cursor,
      pageSize,
    },
  }));
}

async function inviteToGroupChat(data: InviteToGroupChatApiBody) {
  return treatAxiosRequest<InviteToGroupChatApiResponse>(() => inviteClient.post('/group', data));
}

export const backendInviteApi = {
  getUserInvites,
  inviteToGroupChat,
};
