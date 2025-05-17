import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import {
  CreateInviteRepositoryParams,
  CreateInviteRepositoryResponse,
} from '../dto/create-invite';
import { ChatInvite } from 'generated/prisma';

export interface InviteRepository extends PrismaRepository {
  create(
    data: CreateInviteRepositoryParams,
  ): Promise<CreateInviteRepositoryResponse>;
  getById(id: string): Promise<unknown>;
  getAllByUserId(userId: string): Promise<CreateInviteRepositoryResponse[]>;
  updateInvite(inviteId: string, data: Partial<ChatInvite>): Promise<void>;
}
