import { z } from 'zod';
import { passwordSchema } from './shared.schema';
import { ZodSchema } from 'src/shared/schemas/zod.schema';

const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const LoginSchema = new ZodSchema(loginSchema);
