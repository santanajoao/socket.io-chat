import {
  CreateInviteRepositoryParams,
  CreateInviteRepositoryResponse,
} from '../dto/create-invite';
import {
  GetAllByUserIdRepositoryParams,
  GetAllByUserIdRepositoryResponse,
} from '../dto/get-all-by-user-id';
import { ChatInviteModel } from '../models/chat-invite.model';

export interface InviteRepository {
  create(
    data: CreateInviteRepositoryParams,
  ): Promise<CreateInviteRepositoryResponse>;
  getById(id: string): Promise<unknown>;
  getAllByUserId(
    params: GetAllByUserIdRepositoryParams,
  ): Promise<GetAllByUserIdRepositoryResponse>;
  updateInvite(inviteId: string, data: Partial<ChatInviteModel>): Promise<void>;
  getByChatIdAndUserId(
    chatId: string,
    userId: string,
  ): Promise<ChatInviteModel | null>;
}
