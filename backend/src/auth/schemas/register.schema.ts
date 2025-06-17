import { z } from 'zod';
import { passwordSchema, usernameSchema } from './shared.schema';
import { ZodSchema } from 'src/shared/schemas/zod.schema';

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  username: usernameSchema,
});

export const RegisterSchema = new ZodSchema(registerSchema);
