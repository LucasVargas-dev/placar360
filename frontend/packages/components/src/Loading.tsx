import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'phosphor-react';

export type LoadingProps<C extends ElementType> = {
	message?: string;
	icon?: ReactNode;
	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'div';

/**
 * Loading component
 * Displays a loading indicator with a spinner and message
 * @param {object} root0
 * @param {string} root0.message
 * @param {ReactNode} root0.icon
 * @param {any} root0.as
 * @param {string} root0.className
 *
 * @returns {JSX.Element}
 */
export function Loading<C extends ElementType = typeof defaultElement>({
	message,
	icon,
	as,
	className = '',
	...rest
}: LoadingProps<C>) {
	const { t: translate } = useTranslation();
	const Component = as || defaultElement;

	const defaultIcon = (
		<Spinner
			size={24}
			className='animate-spin mr-2'
		/>
	);

	const defaultMessage = translate('loadingInformation');

	const baseStyles =
		'bg-transparent text-gray-800 dark:bg-primary-500 dark:text-gray-100 flex items-center justify-center w-full p-6 text-base font-medium';

	return (
		<Component
			className={`${baseStyles} ${className}`}
			{...rest}
		>
			{icon || defaultIcon}
			<span>{message || defaultMessage}</span>
		</Component>
	);
}

export default Loading;
