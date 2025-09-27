import { UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { ZodSchema } from 'zod';

export function ZodValidation(schema: ZodSchema) {
  return UsePipes(new ZodValidationPipe(schema));
}
