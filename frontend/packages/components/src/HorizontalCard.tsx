import clsx from 'clsx';

interface HorizontalCardProps {
	backgroundColor?: string;
	backgroundOpacity?: string;
	sideLineColor?: string;
	title: React.ReactNode;
	titleColor?: string;
	subtitle?: React.ReactNode;
	subtitleColor?: string;
	children?: React.ReactNode;
}

/**
 * HorizontalCard
 * @param {HorizontalCardProps} root0
 * @param {React.ReactNode} root0.children
 * @param {string} root0.backgroundColor
 * @param {string} root0.backgroundOpacity
 * @param {string} root0.sideLineColor
 * @param {string} root0.title
 * @param {string} root0.titleColor
 * @param {React.ReactNode} root0.subtitle
 * @param {string} root0.subtitleColor
 *
 * @returns {JSX.Element}
 */
export function HorizontalCard({
	backgroundColor,
	backgroundOpacity,
	sideLineColor,
	title,
	titleColor,
	subtitle,
	subtitleColor,
	children,
}: HorizontalCardProps) {
	return (
		<div className='flex w-full rounded-md shadow-md'>
			<div
				className={clsx(sideLineColor ?? 'bg-primary-500', 'w-3 rounded-l-md')}
			></div>
			<div
				className={clsx(
					backgroundColor ?? 'bg-white',
					backgroundOpacity ?? 'bg-opacity-100',
					'flex flex-col w-full h-full rounded-r-md px-4 py-2'
				)}
			>
				<div className='flex justify-between '>
					<h2
						className={clsx(titleColor ?? 'text-black', 'text-lg font-medium ')}
					>
						{title}
					</h2>
					{subtitle && (
						<div className='flex items-center'>
							<div
								className={clsx(
									subtitleColor ?? 'text-primary-500',
									'text-lg font-bold'
								)}
							>
								{subtitle}
							</div>
						</div>
					)}
				</div>
				{children}
			</div>
		</div>
	);
}
