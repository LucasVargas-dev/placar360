import { ReactNode } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';
import Button from './Button.js';

export type FormWrapperProps<
	T extends Record<string, any> = Record<string, any>,
> = {
	onFormSubmit: (data: T) => Promise<any> | void;
	defaultValues: T;
	form: UseFormReturn<T>;
	children: ReactNode;
	isSubmitting?: boolean;
	submitLabel?: string;
	cancelLabel?: string;
	onCancel?: () => void;
	bypassFormSubmit?: boolean;
	isDisabled?: boolean;
	title?: string;
	showHeader?: boolean;
	showButtons?: boolean;
	className?: string;
	headerClassName?: string;
	footerClassName?: string;
	formClassName?: string;
};

/**
 * FormWrapper - A component for forms in a fixed layout
 * Similar to FormModal but without the modal wrapper
 * @param {object} root0
 * @param {Function} root0.onFormSubmit
 * @param {object} root0.form
 * @param {ReactNode} root0.children
 * @param {boolean} root0.isSubmitting
 * @param {string} root0.submitLabel
 * @param {string} root0.cancelLabel
 * @param {Function} root0.onCancel
 * @param {boolean} root0.bypassFormSubmit
 * @param {boolean} root0.isDisabled
 * @param {string} root0.title
 * @param {boolean} root0.showHeader
 * @param {boolean} root0.showButtons
 * @param {string} root0.className
 * @param {string} root0.headerClassName
 * @param {string} root0.footerClassName
 * @param {string} root0.formClassName
 *
 * @returns {JSX.Element}
 */
export function FormWrapper<
	T extends Record<string, any> = Record<string, any>,
>({
	onFormSubmit,
	form,
	children,
	isSubmitting = false,
	submitLabel = 'Salvar',
	cancelLabel = 'Cancelar',
	onCancel,
	bypassFormSubmit = false,
	isDisabled = false,
	title,
	showHeader = true,
	showButtons = true,
	className = '',
	headerClassName = '',
	footerClassName = '',
	formClassName = '',
}: FormWrapperProps<T>) {
	return (
		<div className={`bg-white rounded-lg border shadow-sm ${className}`}>
			{showHeader && title && (
				<div className={`border-b px-6 py-4 ${headerClassName}`}>
					<h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
				</div>
			)}

			<FormProvider {...form}>
				<form
					className={`p-6 ${formClassName}`}
					onSubmit={
						bypassFormSubmit
							? e => e.preventDefault()
							: form.handleSubmit(onFormSubmit)
					}
				>
					{children}
				</form>
			</FormProvider>

			{showButtons && (
				<div
					className={`border-t px-6 py-4 flex justify-end gap-3 ${footerClassName}`}
				>
					<Button
						variant='secondary'
						onClick={e => {
							e.preventDefault();
							onCancel?.();
						}}
						disabled={isSubmitting}
					>
						{cancelLabel}
					</Button>
					<Button
						variant='primary'
						onClick={
							bypassFormSubmit
								? () => onFormSubmit(form.getValues() as T)
								: form.handleSubmit(onFormSubmit)
						}
						isDisabled={isSubmitting || isDisabled}
						isLoading={isSubmitting}
					>
						{submitLabel}
					</Button>
				</div>
			)}
		</div>
	);
}
