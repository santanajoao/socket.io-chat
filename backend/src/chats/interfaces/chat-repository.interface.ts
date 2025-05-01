import {
  GetAllByUserIdParams,
  GetAllByUserIdResponse,
} from '../dtos/get-all-by-user-id';

export interface ChatRepository {
  getAllUserChatIds({
    userId,
  }: GetAllByUserIdParams): Promise<GetAllByUserIdResponse>;
}
