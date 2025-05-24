import { backendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { GetUserInviteResponse } from "../types/user-invites";
import { OnInviteResponseBody, RespondInviteParams } from "../types/respond-invite";
import { InviteToGroupChatApiBody, InviteToGroupChatApiResponse } from "@/modules/chats/types/inviteToGroupChat";

const inviteClient = backendApi.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/invites`,
});

async function getUserInvites() {
  return treatAxiosRequest<GetUserInviteResponse>(() => inviteClient.get('/'));
}

async function respondInvite(data: RespondInviteParams) {
  return treatAxiosRequest<OnInviteResponseBody>(() => inviteClient.post(`${data.inviteId}/respond`, { accept: data.accept }));
}

async function inviteToGroupChat(data: InviteToGroupChatApiBody) {
  return treatAxiosRequest<InviteToGroupChatApiResponse>(() => inviteClient.post('/group', data));
}

export const backendInviteApi = {
  getUserInvites,
  respondInvite,
  inviteToGroupChat,
};
