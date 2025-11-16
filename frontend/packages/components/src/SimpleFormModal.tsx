import { PropsWithChildren, useEffect, useState } from 'react';
import { DefaultValues, FieldValues, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormModal } from './FormModal.js';
import { ModalSize } from './Modal.js';

export type FormModalActionProps<T extends FieldValues> = PropsWithChildren & {
	title: string;
	onFormSubmit: (values: Partial<T>) => Promise<boolean> | boolean;
	submitLabel: string;
	cancelLabel?: string;
	form: UseFormReturn<T>;
	defaultValues: Partial<T>;
	formResetValues?: () => DefaultValues<T> | Promise<DefaultValues<T>>;
	size?: ModalSize;
};

export type SimpleFormModalProps<T extends FieldValues> =
	FormModalActionProps<T> & {
		isOpen: boolean;
		hide: () => void;
		refresh: () => void;
	};

/**
 * Simple use of the FormModal that abstracts common functionality
 * @param {SimpleFormModalProps} root0
 * @param {string} root0.title
 * @param {boolean} root0.isOpen
 * @param {() => void} root0.hide
 * @param {UseFormReturn} root0.form
 * @param {(values: T) => Promise<void> | void} root0.onFormSubmit
 * @param {Partial<T>} root0.defaultValues
 * @param {string} root0.submitLabel
 * @param {ReactNode} root0.children
 * @param {() => void} root0.refresh
 * @returns {JSX.Element}
 */
export function SimpleFormModal<T extends FieldValues>({
	title,
	isOpen,
	hide,
	form,
	onFormSubmit,
	defaultValues,
	submitLabel,
	cancelLabel,
	children,
	refresh,
	formResetValues,
	size,
}: SimpleFormModalProps<T>) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		(async () => {
			if (formResetValues) form.reset(await formResetValues());
		})();
	}, [isOpen]);

	const { t: translate } = useTranslation();
	return (
		<FormModal
			size={size}
			title={translate(title)}
			isOpen={isOpen}
			onClose={() => {
				hide();
				form.reset();
			}}
			onFormSubmit={async values => {
				try {
					setIsSubmitting(true);
					const success = await onFormSubmit(values);
					if (success) {
						form.reset();
						hide();
						refresh();
					}
				} finally {
					setIsSubmitting(false);
				}
			}}
			form={form}
			defaultValues={defaultValues}
			submitLabel={translate(submitLabel)}
			cancelLabel={cancelLabel && translate(cancelLabel)}
			isSubmitting={isSubmitting}
		>
			{children}
		</FormModal>
	);
}
