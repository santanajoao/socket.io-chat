import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import {
  CreateChatRepositoryParams,
  CreateChatRepositoryResponse,
} from '../dtos/create-chat';
import {
  GetAllUserChatIdsParams,
  GetAllUserChatIdsResponse,
} from '../dtos/get-all-user-chat-ids';
import {
  GetUserPaginatedChatListRepositoryParams,
  GetUserPaginatedChatListResponse,
} from '../dtos/get-user-paginated-chat-list';
import { GetDirectChatByUserIdsParams } from './get-chat-by-type-and-users';
import { ChatModel } from '../models/chat.model';

export interface ChatRepository extends PrismaRepository {
  getAllUserChatIds({
    userId,
  }: GetAllUserChatIdsParams): Promise<GetAllUserChatIdsResponse>;

  getUserPaginatedChatList(
    params: GetUserPaginatedChatListRepositoryParams,
  ): Promise<GetUserPaginatedChatListResponse>;
  createChat(
    param: CreateChatRepositoryParams,
  ): Promise<CreateChatRepositoryResponse>;
  getDirectChatByUserIds(
    params: GetDirectChatByUserIdsParams,
  ): Promise<unknown>;
  getChatById(id: string): Promise<ChatModel | null>;
}
