import { CreateInviteRepositoryResponse } from './create-invite';

export class GetAllByUserIdRepositoryParams {
  userId: string;
  cursor?: string;
  limit?: number;
}

export class GetAllByUserIdRepositoryResponse {
  invites: CreateInviteRepositoryResponse[];
  totalUnanswered: number;
}

export class GetAllByUserIdServiceParams {
  userId: string;
  cursor?: string;
  pageSize?: number;
}
