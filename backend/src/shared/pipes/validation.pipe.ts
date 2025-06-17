import { BadRequestException, PipeTransform } from '@nestjs/common';

export type SchemaInvalidResponse = {
  valid: false;
  error: string;
};

export type SchemaValidResponse<T> = {
  valid: true;
  data: T;
};

export type SchemaResponse<T> = SchemaValidResponse<T> | SchemaInvalidResponse;

export interface Schema<T> {
  parse(data: unknown): SchemaResponse<T>;
}

export class ValidationPipe<T extends Schema<unknown>>
  implements PipeTransform
{
  constructor(private readonly schema: T) {}

  transform(value: unknown) {
    const response = this.schema.parse(value);

    if (response.valid) {
      return response.data;
    }

    throw new BadRequestException(response.error);
  }
}
