import { z } from 'zod';
import { groupChatTitleSchema } from './shared.schema';
import { ZodSchema } from 'src/shared/schemas/zod.schema';

const updateChatGroupSchema = z.object({
  title: groupChatTitleSchema,
});

export const UpdateChatGroupSchema = new ZodSchema(updateChatGroupSchema);
