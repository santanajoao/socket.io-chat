import { ZodSchema } from 'src/shared/schemas/zod.schema';
import { z } from 'zod';

const createDirectChatSchema = z.object({
  receiverEmail: z.string().email(),
});

export const CreateDirectChatSchema = new ZodSchema(createDirectChatSchema);
