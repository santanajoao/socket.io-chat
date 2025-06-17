import { ZodSchema } from 'src/shared/schemas/zod.schema';
import { z } from 'zod';
import { groupChatTitleSchema } from './shared.schema';

const createGroupChatSchema = z.object({
  title: groupChatTitleSchema,
});

export const CreateGroupChatSchema = new ZodSchema(createGroupChatSchema);
