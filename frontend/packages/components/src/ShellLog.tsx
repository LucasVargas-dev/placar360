import { useRef, useEffect, useState } from 'react';
import AnsiToHtml from 'ansi-to-html';
import clsx from 'clsx';
interface ShellLogProps {
	logs: string[];
	title?: string;
	maxHeight?: string;
	className?: string;
	autoScroll?: boolean;
}

/**
 * Displays a list of strings similar to how the console does
 * @param {ShellLogProps} root0
 * @param {string[]} root0.logs
 * @param {number | undefined} root0.title
 * @param {string | undefined} root0.maxHeight
 * @param {string | undefined} root0.className
 * @param {boolean | undefined} root0.autoScroll
 * @returns {JSX.Element}
 */
export function ShellLog({
	logs,
	title,
	maxHeight,
	className,
	autoScroll = true,
}: ShellLogProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [isAutoScroll, setIsAutoScroll] = useState(true);
	const isProgrammaticScroll = useRef(false);

	// Sets atBottom only when the user scrolled to the bottom so that it doesnt auto scroll when viewing old logs
	useEffect(() => {
		const scrollContainer = scrollRef.current;
		const contentContainer = contentRef.current;
		if (!scrollContainer || !contentContainer) return;

		/**
		 * Detects if the logs are supposed to auto scroll by checking if the user is at the bottom and the container was not scrolled by the program
		 */
		const handleScroll = () => {
			if (isProgrammaticScroll.current) {
				isProgrammaticScroll.current = false;
				return;
			}

			const atBottom =
				scrollContainer.scrollTop + scrollContainer.clientHeight >=
				contentContainer.scrollHeight - 50;
			setIsAutoScroll(atBottom);
		};

		scrollContainer.addEventListener('scroll', handleScroll);
		return () => scrollContainer.removeEventListener('scroll', handleScroll);
	}, []);

	// Auto-scroll to bottom when logs change
	useEffect(() => {
		if (autoScroll && scrollRef.current && contentRef.current) {
			const scrollContainer = scrollRef.current;
			const contentContainer = contentRef.current;
			if (scrollContainer && contentContainer && isAutoScroll) {
				isProgrammaticScroll.current = true;
				requestAnimationFrame(() => {
					scrollContainer.scrollTo({
						top: contentContainer.scrollHeight,
						behavior: 'auto',
					});
				});
			}
		}
	}, [logs, autoScroll, isAutoScroll]);

	return (
		<div
			className={clsx(
				'rounded-md border border-gray-800 bg-gray-900 text-white',
				className
			)}
		>
			{title && (
				<div className='px-4 py-2 border-b border-gray-800 bg-gray-800 flex items-center justify-between'>
					<h3 className='text-sm font-mono'>{title}</h3>
				</div>
			)}
			<div
				className={clsx(
					'relative overflow-auto rounded w-full font-mono text-sm custom-scroll'
				)}
				style={{ maxHeight }}
				ref={scrollRef}
			>
				<div
					className='p-4 whitespace-pre-wrap'
					ref={contentRef}
				>
					{logs.length === 0 ? (
						<span className='text-gray-500'>No logs to display</span>
					) : (
						logs.map((log, index) => (
							<div key={index}>
								<span className='text-gray-500 mr-2'>$</span>
								<span
									key={index}
									style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
									dangerouslySetInnerHTML={{
										__html: new AnsiToHtml().toHtml(log),
									}}
								/>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
