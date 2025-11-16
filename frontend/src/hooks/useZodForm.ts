import { zodResolver } from '@hookform/resolvers/zod';
import { type TypeOf, type ZodSchema } from 'zod';
import {
	type UseFormProps,
	type UseFormReturn,
	useForm,
} from 'react-hook-form';

type UseZodFormProps<TSchema extends ZodSchema> = {
	schema: TSchema;
} & Omit<UseFormProps<TypeOf<TSchema>>, 'resolver'>;

/**
 * Wrapper around `useForm` already configured with `zodResolver`.
 * Keeps form configuration colocated with its schema.
 */
export function useZodForm<TSchema extends ZodSchema>({
	schema,
	...formConfig
}: UseZodFormProps<TSchema>): UseFormReturn<TypeOf<TSchema>> {
	return useForm<TypeOf<TSchema>>({
		...formConfig,
		resolver: zodResolver(schema),
	});
}


