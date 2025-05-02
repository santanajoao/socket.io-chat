import {
  GetAllUserChatIdsParams,
  GetAllUserChatIdsResponse,
} from '../dtos/get-all-user-chat-ids';
import {
  GetUserPaginatedChatListRepositoryParams,
  GetUserPaginatedChatListResponse,
} from '../dtos/get-user-paginated-chat-list';

export interface ChatRepository {
  getAllUserChatIds({
    userId,
  }: GetAllUserChatIdsParams): Promise<GetAllUserChatIdsResponse>;

  getUserPaginatedChatList(
    params: GetUserPaginatedChatListRepositoryParams,
  ): Promise<GetUserPaginatedChatListResponse>;
}
