import { ZodSchema } from 'src/shared/schemas/zod.schema';
import { z } from 'zod';

const grantAdminRightsSchema = z.object({
  isAdmin: z.boolean(),
});

export const GrantAdminRightsSchema = new ZodSchema(grantAdminRightsSchema);
