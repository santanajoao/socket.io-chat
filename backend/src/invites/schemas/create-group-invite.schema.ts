import { ZodSchema } from 'src/shared/schemas/zod.schema';
import { z } from 'zod';

const createGroupInviteSchema = z.object({
  chatId: z.string().uuid(),
  email: z.string().email(),
});

export const CreateGroupInviteSchema = new ZodSchema(createGroupInviteSchema);
