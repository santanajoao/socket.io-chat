import { useBackendApi } from "@/modules/shared/apis/backend";
import { treatAxiosRequest } from "@/modules/shared/utils/axios";
import { GetUserChatsParams, GetUserChatsResponse } from "../types/user-chats";

export function useBackendUserApi() {
  const backendApi = useBackendApi();

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
  
  return {
    getUserChats,
  };
}
