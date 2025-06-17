import { z } from 'zod';
import { Schema, SchemaResponse } from '../pipes/validation.pipe';

export class ZodSchema<T extends z.ZodTypeAny> implements Schema<z.infer<T>> {
  constructor(private readonly schema: z.ZodSchema<z.infer<T>>) {}

  parse(data: unknown): SchemaResponse<T> {
    const result = this.schema.safeParse(data);
    if (result.success) {
      return { valid: true, data: result.data };
    }

    const firstError = result.error.issues[0];
    const field = firstError.path[0];
    const error = firstError.message;
    const message = `Field "${field}": ${error}`;

    return { valid: false, error: message };
  }
}
