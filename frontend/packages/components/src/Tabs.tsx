import { ReactNode, useRef, useState } from 'react';
import clsx from 'clsx';

export type TabsVariant = 'primary' | 'secondary' | 'underline';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type TabItem = {
	value: string;
	label: ReactNode;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	disabled?: boolean;
};

export type TabsProps = {
	tabs: TabItem[];
	defaultValue?: string;
	variant?: TabsVariant;
	size?: TabsSize;
	isFullWidth?: boolean;
	className?: string;
	onChange?: (tab: string) => void;
	childrenFn: (activeTab: string) => ReactNode;
};

/**
 * Tabs component
 * @param {TabsProps} root0
 * @param {TabItem[]} root0.tabs
 * @param {string} root0.defaultValue
 * @param {TabsVariant} root0.variant
 * @param {TabsSize} root0.size
 * @param {boolean} root0.isFullWidth
 * @param {string} root0.className
 * @param {Function} root0.onChange
 * @param {Function} root0.childrenFn
 *
 * @returns {any}
 */
export function Tabs({
	tabs,
	defaultValue,
	size = 'md',
	isFullWidth = false,
	className = '',
	onChange,
	childrenFn,
}: TabsProps) {
	const [activeTab, setActiveTab] = useState(defaultValue ?? tabs[0].value);
	const [previousTab, setPreviousTab] = useState<string | null>(null);
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	/**
	 * Handle tab click
	 * @param {string} value
	 * @param {boolean} disabled
	 */
	const handleClick = (value: string, disabled?: boolean) => {
		if (disabled) return;
		setPreviousTab(activeTab);
		setActiveTab(value);
		onChange?.(value);
	};

	const baseTabClasses =
		'transition-all duration-200 font-medium inline-flex items-center gap-2 justify-center relative';

	const sizeClasses: Record<TabsSize, string> = {
		sm: 'px-5 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-7 py-2.5 text-lg',
	};

	return (
		<div className={clsx('w-full', className)}>
			<div className='relative flex w-full flex-wrap border-b-2 border-secondary-500 dark:border-primary-300'>
				{tabs.map(({ value, label, leftIcon, rightIcon, disabled }) => {
					const isBeingActivated = value === activeTab && previousTab !== value;

					return (
						<button
							key={value}
							ref={el => (tabRefs.current[value] = el)}
							disabled={disabled}
							onMouseDown={e => e.preventDefault()}
							onClick={e => {
								e.preventDefault();
								handleClick(value, disabled);
							}}
							className={clsx(
								baseTabClasses,
								sizeClasses[size],
								isFullWidth && 'flex-1',
								disabled && 'cursor-not-allowed',
								value === activeTab
									? 'text-primary-700 dark:text-secondary-100'
									: 'text-secondary-800 dark:text-primary-200 hover:text-secondary-1000 hover:dark:text-primary-100',
								'relative font-semibold',
								'outline-none focus:outline-none focus:ring-0 focus:shadow-none'
							)}
						>
							{leftIcon && <span className='mr-1'>{leftIcon}</span>}
							{label}
							{rightIcon && <span className='ml-1'>{rightIcon}</span>}

							<span
								className={clsx(
									'absolute bottom-[-2px] left-0 h-[2px] bg-primary-700 dark:bg-secondary-100',
									isBeingActivated ? 'transition-all duration-300 ease-in' : '',
									value === activeTab ? 'w-full' : 'w-0'
								)}
								style={
									isBeingActivated
										? { transitionProperty: 'width', width: '100%' }
										: {}
								}
							></span>
						</button>
					);
				})}
			</div>

			{/* Conteúdo da aba ativa */}
			<div className='flex-1 min-h-0 overflow-auto custom-scroll'>
				{childrenFn(activeTab)}
			</div>
		</div>
	);
}

export default Tabs;
