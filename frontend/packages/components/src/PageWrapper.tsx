import clsx from 'clsx';
import { ReactNode } from 'react';

type PageWrapperVariant = 'default' | 'scrollable';

interface PageWrapperProps {
	children: ReactNode;
	className?: string;
	variant?: PageWrapperVariant;
}

/**
 * Wrapper for pages
 * @param {object} root0
 * @param {ReactNode} root0.children
 * @param {string} root0.className
 * @param {PageWrapperVariant} root0.variant
 * @returns {JSX.Element}
 */
export const PageWrapper = ({
	children,
	className,
	variant = 'default',
}: PageWrapperProps) => {
	const baseStyles = 'w-full p-4';

	const variantStyles = {
		default: 'min-h-[calc(100vh-4rem)]',
		scrollable: 'overflow-auto min-h-[calc(100vh-4rem)] max-w-screen custom-scroll',
	};

	return (
		<div className={clsx(baseStyles, variantStyles[variant], className)}>
			{children}
		</div>
	);
};
