// import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
// import { ZodSchema, ZodError } from 'zod';

// @Injectable()
// export class ZodValidationPipe implements PipeTransform {
//   constructor(private schema: ZodSchema) {}

//   transform(value: any, metadata: ArgumentMetadata) {
//     try {
//       const parsedValue = this.schema.parse(value);
//       return parsedValue;
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const errorMessages = error.errors.map(err => ({
//           field: err.path.join('.'),
//           message: err.message,
//         }));
        
//         throw new BadRequestException({
//           message: 'Dados de entrada inválidos',
//           errors: errorMessages,
//         });
//       }
//       throw new BadRequestException('Erro de validação');
//     }
//   }
// }

import { PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

/**
 *
 */
export class ZodValidationPipe implements PipeTransform {
	/**
	 * ZodValidationPipe constructor.
	 * @param {ZodSchema} schema - The schema to be used for validation.
	 */
	constructor(private schema: ZodSchema) {}

	/**
	 * Parse the value using the schema.
	 * @param {Record<string, unknown>} value - The value to be parsed.
	 *
	 * @returns {Record<string, unknown>} - The parsed value.
	 */
	transform(value: Record<string, unknown>): Record<string, unknown> {
		try {
			if (value.args && typeof value.args === 'string') {
				try {
					value.args = JSON.parse(value.args);
				} catch {
					value.args = {};
				}
			}

			const parsedValue = this.schema.parse(value);
			return parsedValue;
		} catch (error) {
			throw new Error('Validation failed');
		}
	}
}
