import {
	ComponentPropsWithoutRef,
	ElementType,
	ReactNode,
	useState,
} from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export type TooltipProps<C extends ElementType> = {
	content: ReactNode;
	position?: TooltipPosition;
	as?: C;
	size?: number;
	className?: string;
	zIndex?: number;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'div';

/**
 * Tooltip component
 * @param {object} root0
 * @param {any} root0.children
 * @param {ReactNode} root0.content
 * @param {TooltipPosition} root0.position
 * @param {any} root0.as
 * @param {number} root0.size
 * @param {string} root0.className
 * @param {number} root0.zIndex
 *
 * @returns {any}
 */
export function Tooltip<C extends ElementType = typeof defaultElement>({
	children,
	content,
	position = 'top',
	as,
	className = '',
	size = 256,
	zIndex = 50,
	...rest
}: TooltipProps<C>) {
	const Component = as || defaultElement;
	const [isVisible, setIsVisible] = useState(false);

	const positionStyles = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2',
	};

	return (
		<Component
			className={`relative ${className}`}
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
			{...rest}
		>
			{children}
			{isVisible && (
				<div
					className={`absolute px-2 py-1 text-sm text-white bg-primary-700 rounded shadow-lg ${positionStyles[position]} flex items-center justify-center`}
					style={{ width: size, zIndex }}
				>
					{content}
				</div>
			)}
		</Component>
	);
}

export default Tooltip;
