/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';
import Modal, { ModalProps } from './Modal.js';
import Button from './Button.js';

export type FormModalProps<
	T extends Record<string, any> = Record<string, any>,
> = {
	onFormSubmit: (data: T) => Promise<any> | void;
	defaultValues: Partial<T>;
	form: UseFormReturn<T>;
	children: ReactNode;
	isSubmitting?: boolean;
	submitLabel?: string;
	cancelLabel?: string;
	onCancel?: () => void;
	bypassFormSubmit?: boolean;
	isDisabled?: boolean;
	onFormError?: (errors: any) => void;
} & Omit<ModalProps, 'children'>;

/**
 * FormModal
 * @param {FormModalProps} root0
 * @param {Function} root0.onFormSubmit
 * @param {UseFormReturn} root0.form
 * @param {object} root0.defaultValues
 * @param {ReactNode} root0.children
 * @param {boolean} root0.isSubmitting
 * @param {string} root0.submitLabel
 * @param {string} root0.cancelLabel
 * @param {Function} root0.onCancel
 * @param {boolean} root0.isDisabled
 *
 * @returns {JSX.Element}
 */
export function FormModal<T extends Record<string, any> = Record<string, any>>({
	onFormSubmit,
	form,
	defaultValues,
	children,
	isSubmitting = false,
	submitLabel = 'Salvar',
	cancelLabel = 'Cancelar',
	onCancel,
	bypassFormSubmit = false,
	isDisabled = false,
	onFormError,
	...modalProps
}: FormModalProps<T>) {
	return (
		<Modal
			{...modalProps}
			className='bg-white text-secondary-900'
			footerButtons={
				<>
					<Button
						variant='secondary'
						onClick={e => {
							e.preventDefault();
							onCancel ? onCancel() : modalProps.onClose();
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
								: form.handleSubmit(onFormSubmit, onFormError)
						}
						isDisabled={isSubmitting || isDisabled}
						isLoading={isSubmitting}
					>
						{submitLabel}
					</Button>
				</>
			}
		>
			<FormProvider {...form}>
				<form
					onSubmit={
						bypassFormSubmit
							? e => e.preventDefault()
							: form.handleSubmit(onFormSubmit, onFormError)
					}
				>
					{children}
				</form>
			</FormProvider>
		</Modal>
	);
}
