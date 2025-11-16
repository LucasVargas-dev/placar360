import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { Button } from './Button.js';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'flat';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type CardBorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type CardTextAlign = 'left' | 'center' | 'right';
export type CardActionAlignment = 'left' | 'center' | 'right';

export type CardActionButton = {
	text: string;
	onClick: () => void;
	variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
	icon?: ReactNode;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	disabled?: boolean;
};

export type CardBadge = {
	text: string;
	variant?:
		| 'default'
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'info';
	size?: 'sm' | 'md' | 'lg';
};

export type CardStatus = {
	label: string;
	variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
	showDot?: boolean;
};

export type CardStats = {
	icon?: ReactNode;
	label: string;
	value: string | number;
};

export type CardProps<C extends ElementType> = {
	children?: ReactNode;
	variant?: CardVariant;
	size?: CardSize;
	borderRadius?: CardBorderRadius;
	textAlign?: CardTextAlign;
	hasHoverEffect?: boolean;
	isInteractive?: boolean;

	headerImage?: string;
	headerImageAlt?: string;
	title?: ReactNode;
	subtitle?: ReactNode;
	badge?: CardBadge;
	status?: CardStatus;

	stats?: CardStats[];
	tags?: string[];

	primaryAction?: CardActionButton;
	secondaryAction?: CardActionButton;
	onCardClick?: () => void;

	footer?: ReactNode;
	isLoading?: boolean;
	as?: C;
	className?: string;
	actionAlignment?: CardActionAlignment;
} & Omit<ComponentPropsWithoutRef<C>, 'title'>;

const defaultElement = 'div';

/**
 * Card generic component to display structured information
 * @param {string} root0
 * @param {ReactNode} root0.children
 * @param {CardVariant} root0.variant
 * @param {CardSize} root0.size
 * @param {CardBorderRadius} root0.borderRadius
 * @param {CardTextAlign} root0.textAlign
 * @param {boolean} root0.hasHoverEffect
 * @param {boolean} root0.isInteractive
 * @param {string} root0.headerImage
 * @param {string} root0.headerImageAlt
 * @param {ReactNode} root0.title
 * @param {ReactNode} root0.subtitle
 * @param {CardBadge} root0.badge
 * @param {CardStatus} root0.status
 * @param {CardStats[]} root0.stats
 * @param {string[]} root0.tags
 * @param {CardActionButton} root0.primaryAction
 * @param {CardActionButton} root0.secondaryAction
 * @param {() => void} root0.onCardClick
 * @param {ReactNode} root0.footer
 * @param {boolean} root0.isLoading
 * @param {C} root0.as
 * @param {string} root0.className
 * @param {CardActionAlignment} root0.actionAlignment
 *
 * @returns {JSX.Element}
 */
export function InfoCard<C extends ElementType = typeof defaultElement>({
	children,
	variant = 'default',
	size = 'md',
	borderRadius = 'md',
	textAlign = 'left',
	hasHoverEffect = false,
	isInteractive = false,

	headerImage,
	headerImageAlt = '',
	title,
	subtitle,
	badge,
	status,

	stats,
	tags,

	primaryAction,
	secondaryAction,
	onCardClick,

	footer,
	isLoading = false,
	as,
	className = '',
	actionAlignment = 'right',
	...rest
}: CardProps<C>) {
	const Component = as || defaultElement;

	const baseStyles =
		'flex flex-col overflow-hidden transition-all duration-300';

	const variantStyles = {
		// default: 'bg-white shadow-sm border border-gray-200',
		// outlined: 'bg-white border border-gray-300',
		// elevated: 'bg-white shadow-lg border border-gray-100',
		// flat: 'bg-gray-50 border border-gray-200',
		default:
			'bg-white dark:bg-primary-500 shadow-sm border border-gray-100 dark:border-primary-700',
		outlined:
			'bg-white dark:bg-primary-500 border border-secondary-500 dark:border-primary-300',
		elevated: 'bg-white dark:bg-primary-500 shadow-lg',
		flat: 'bg-gray-50 border dark:bg-primary-500 border-gray-100 dark:border-primary-700',
	};

	const sizeStyles = {
		sm: 'max-w-xs',
		md: 'max-w-sm',
		lg: 'max-w-md',
		xl: 'max-w-lg',
		full: 'w-full',
	};

	const textAlignStyles = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right',
	};

	const borderRadiusStyles = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-xl',
	};

	const hoverStyles = hasHoverEffect
		? 'hover:shadow-xl hover:-translate-y-1 hover:border-gray-200-'
		: '';

	const interactiveStyles = isInteractive
		? 'cursor-pointer dark:ring-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50'
		: '';

	const actionAlignmentStyles = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end',
	};

	const badgeVariantStyles = {
		default: 'bg-gray-100 text-gray-800',
		primary: 'bg-blue-100 text-blue-800',
		secondary: 'bg-gray-100 text-gray-800',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-orange-100 text-orange-800',
		danger: 'bg-red-100 text-red-800',
		info: 'bg-sky-100 text-sky-800',
	};

	const badgeSizeStyles = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2 py-1 text-xs',
		lg: 'px-3 py-1 text-sm',
	};

	const statusVariantStyles = {
		success: {
			dot: 'bg-green-500',
			text: 'text-green-700',
		},
		warning: {
			dot: 'bg-orange-500',
			text: 'text-orange-700',
		},
		danger: {
			dot: 'bg-red-500',
			text: 'text-red-700',
		},
		info: {
			dot: 'bg-blue-800',
			text: 'text-blue-800',
		},
		default: {
			dot: 'bg-gray-500',
			text: 'text-gray-700',
		},
	};

	if (isLoading) {
		return (
			<Component
				className={`
					${baseStyles}
					${variantStyles[variant]}
					${sizeStyles[size]}
					${borderRadiusStyles[borderRadius]}
					animate-pulse
					${className}
				`}
				{...rest}
			>
				{headerImage && (
					<div className='h-48 bg-gradient-to-r from-gray-200 to-gray-300'></div>
				)}
				<div className='p-4 border-b border-gray-200 dark:border-primary-400'>
					<div className='h-6 bg-gray-200 dark:bg-primary-400 rounded-md mb-2'></div>
					<div className='h-4 bg-gray-200 dark:bg-primary-400 rounded-md w-2/3'></div>
				</div>
				<div className='p-4 space-y-3'>
					<div className='flex justify-between items-center'>
						<div className='h-5 bg-gray-200 dark:bg-primary-400 rounded-full w-16'></div>
						<div className='h-4 bg-gray-200 dark:bg-primary-400 rounded-md w-20'></div>
					</div>
					<div className='flex gap-4'>
						<div className='h-4 bg-gray-200 dark:bg-primary-400 rounded-md w-16'></div>
						<div className='h-4 bg-gray-200 dark:bg-primary-400 rounded-md w-16'></div>
						<div className='h-4 bg-gray-200 dark:bg-primary-400 rounded-md w-16'></div>
					</div>
					<div className='flex gap-2'>
						<div className='h-8 bg-gray-200 dark:bg-primary-400 rounded-md w-16'></div>
						<div className='h-8 bg-gray-200 dark:bg-primary-400 rounded-md w-20'></div>
					</div>
				</div>
			</Component>
		);
	}

	/**
	 * Handles the card click event
	 */
	const handleCardClick = () => {
		if (onCardClick) {
			onCardClick();
		}
	};

	const interactiveProps = isInteractive
		? {
				role: 'button',
				tabIndex: 0,
				'aria-pressed': false,
				/**
				 * Handles keyboard events for accessibility
				 * @param {React.KeyboardEvent} e
				 */
				onKeyDown: (e: React.KeyboardEvent) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleCardClick();
					}
				},
				onClick: handleCardClick,
			}
		: {};

	const hasFooterContent = footer || primaryAction || secondaryAction;

	return (
		<Component
			className={`
				${baseStyles}
				${variantStyles[variant]}
				${sizeStyles[size]}
				${borderRadiusStyles[borderRadius]}
				${hoverStyles}
				${interactiveStyles}
				${className}
			`}
			{...interactiveProps}
			{...rest}
		>
			{headerImage && (
				<div className='relative w-full overflow-hidden group'>
					<img
						src={headerImage}
						alt={headerImageAlt}
						className='w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105'
					/>
					<div className='absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent'></div>
				</div>
			)}

			{(title || subtitle || badge || status) && (
				<div
					className={`p-4 border-b border-gray-100 dark:border-primary-300 dark:bg-primary-500 ${textAlignStyles[textAlign]}`}
				>
					{title && (
						<div className='text-lg font-semibold text-blue-800 dark:text-secondary-100 mb-1 line-clamp-2'>
							{title}
						</div>
					)}
					{subtitle && (
						<div className='text-sm text-gray-800 dark:text-secondary-700 line-clamp-1'>
							{subtitle}
						</div>
					)}

					{(badge || status) && (
						<div className='flex justify-between items-center'>
							{badge && (
								<div
									className={`
									rounded-full font-medium
									${badgeVariantStyles[badge.variant || 'default']}
									${badgeSizeStyles[badge.size || 'md']}
								`}
								>
									{badge.text}
								</div>
							)}
							{status && (
								<div className='flex items-center gap-2 text-sm'>
									{status.showDot && (
										<div
											className={`w-2 h-2 rounded-full ${statusVariantStyles[status.variant || 'default'].dot}`}
										></div>
									)}
									<span
										className={
											statusVariantStyles[status.variant || 'default'].text
										}
									>
										{status.label}
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			)}

			<div className='flex-grow p-4'>
				{stats && stats.length > 0 && (
					<div className='flex gap-4 mb-3 text-xs text-gray-800 dark:text-secondary-700 flex-wrap'>
						{stats.map((stat, index) => (
							<span
								key={index}
								className='flex items-center gap-1'
							>
								{stat.icon && <span>{stat.icon}</span>}
								<span>
									{stat.value} {stat.label}
								</span>
							</span>
						))}
					</div>
				)}

				{tags && tags.length > 0 && (
					<div className='flex flex-col gap-1 mb-3 items-start'>
						{tags.map((tag, index) => (
							<span
								key={index}
								className='inline-block px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-md'
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{children && (
					<div
						className={`text-gray-700 dark:text-secondary-300 text-sm leading-relaxed ${textAlignStyles[textAlign]}`}
					>
						{children}
					</div>
				)}
			</div>

			{hasFooterContent && (
				<div className='px-4 py-3 bg-gray-50 dark:bg-primary-500 border-t border-gray-100 dark:border-primary-300'>
					<div
						className={
							primaryAction || secondaryAction ? 'flex items-center' : ''
						}
					>
						{footer && (
							<div
								className={primaryAction || secondaryAction ? 'flex-grow' : ''}
							>
								{footer}
							</div>
						)}

						{(primaryAction || secondaryAction) && (
							<div
								className={`flex items-center gap-2 ${actionAlignmentStyles[actionAlignment]} ${
									footer ? 'ml-auto' : 'w-full'
								}`}
							>
								{secondaryAction && (
									<Button
										variant={secondaryAction.variant || 'secondary'}
										size={secondaryAction.size || 'sm'}
										disabled={secondaryAction.disabled}
										onClick={e => {
											e.stopPropagation();
											secondaryAction.onClick();
										}}
									>
										{secondaryAction.icon && (
											<span className='mr-1'>{secondaryAction.icon}</span>
										)}
										{secondaryAction.text}
									</Button>
								)}

								{primaryAction && (
									<Button
										variant={primaryAction.variant || 'primary'}
										size={primaryAction.size || 'sm'}
										disabled={primaryAction.disabled}
										onClick={e => {
											e.stopPropagation();
											primaryAction.onClick();
										}}
									>
										{primaryAction.icon && (
											<span className='mr-1'>{primaryAction.icon}</span>
										)}
										{primaryAction.text}
									</Button>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</Component>
	);
}

export default InfoCard;
