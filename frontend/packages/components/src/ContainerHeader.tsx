import clsx from 'clsx';
import { CaretRight } from 'phosphor-react';
import React from 'react';
export type ContainerBorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

type ContainerHeaderProps = {
	title: string;
	icon: React.ReactNode;
	borderRadius?: ContainerBorderRadius;
	className?: string;
	onClick?: () => void;
	isOpen?: boolean;
};
/**
 * ContainerHeader
 * @param {object} root0
 * @param {string} root0.title
 * @param {React.ReactNode} root0.icon
 * @param {string} root0.className
 * @param {ContainerBorderRadius} root0.borderRadius
 * @returns {JSX.Element}
 */
export const ContainerHeader = React.forwardRef<
	HTMLDivElement,
	ContainerHeaderProps
>(({ title, icon, className, onClick, isOpen, borderRadius = 'none' }, ref) => {
	const baseStyles =
		'flex items-center justify-between bg-white px-6 py-4 text-base text-secondary-900 border-b border-secondary-200';

	const borderRadiusStyles = {
		none: 'rounded-t-none',
		sm: 'rounded-t-sm',
		md: 'rounded-t-md',
		lg: 'rounded-t-lg',
		full: 'rounded-t-xl',
	};

	const interactiveStyles = onClick
		? 'hover:bg-secondary-100 cursor-pointer'
		: '';

	return (
		<div
			ref={ref}
			className={clsx(
				baseStyles,
				borderRadiusStyles[borderRadius],
				interactiveStyles,
				className
			)}
			onClick={onClick}
		>
			<div className='flex items-center'>
				{icon}
				<div className={`${icon && 'ml-2'} font-sans`}>{title}</div>
			</div>
			{onClick && (
				<CaretRight
					className={`h-4 w-4 duration-200 ease-in-out ${isOpen && 'rotate-90'}`}
				/>
			)}
		</div>
	);
});
