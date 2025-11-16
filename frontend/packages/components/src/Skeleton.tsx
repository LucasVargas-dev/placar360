import clsx from 'clsx';

/**
 * Skeleton component
 * @param {object} root0
 * @param {string} root0.className
 *
 * @returns {JSX.Element}
 */
function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx(
				'animate-pulse rounded-md bg-zinc-200 dark:bg-darkBlue',
				className
			)}
			{...props}
		/>
	);
}

export { Skeleton };
