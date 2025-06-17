import { PipeTransform } from '@nestjs/common';
import { z } from 'zod';

export class ZodValidationPipe<T extends z.ZodTypeAny>
  implements PipeTransform
{
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    const result = this.schema.safeParse(value);
    if (result.success) {
      return result.data as unknown;
    }

    const firstErrorMessage =
      result.error.issues[0]?.message || 'Validation failed';
    throw new Error(firstErrorMessage);
  }
}
