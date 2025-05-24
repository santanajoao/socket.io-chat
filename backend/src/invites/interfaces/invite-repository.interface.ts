import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import {
  CreateInviteRepositoryParams,
  CreateInviteRepositoryResponse,
} from '../dto/create-invite';
import { ChatInviteModel } from '../models/chat-invite.model';

export interface InviteRepository extends PrismaRepository {
  create(
    data: CreateInviteRepositoryParams,
  ): Promise<CreateInviteRepositoryResponse>;
  getById(id: string): Promise<unknown>;
  getAllByUserId(userId: string): Promise<CreateInviteRepositoryResponse[]>;
  updateInvite(inviteId: string, data: Partial<ChatInviteModel>): Promise<void>;
  getByChatIdAndUserId(
    chatId: string,
    userId: string,
  ): Promise<ChatInviteModel | null>;
}
