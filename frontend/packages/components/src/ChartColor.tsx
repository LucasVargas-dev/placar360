import { useEffect, useRef } from 'react';

type OnChange = ({
	color,
	bgColor,
}: {
	color: string;
	bgColor: string;
}) => void;

export type ChartColorProps = {
	onChange: OnChange;
	color?: string;
	bgColor?: string;
};

/**
 * Helper to ge the hex value of a color defined in tailwindcss
 * @param {object} root0
 * @param {string} root0.color
 * @param {OnChstringange} root0.bgColor
 * @param {OnChange} root0.onChange
 *
 * @returns {JSX.Element}
 */
export function ChartColor({
	color,
	onChange,
	bgColor,
}: ChartColorProps): JSX.Element {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		/**
		 * Update Color
		 */
		const onChangeCallback = () => {
			onChange({
				bgColor: bgColor ? getComputedStyle(ref.current!).backgroundColor : '',
				color: color ? getComputedStyle(ref.current!).color : '',
			});
		};
		onChangeCallback();
		const observer = new MutationObserver(onChangeCallback);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={`hidden ${color} ${bgColor}`}
		/>
	);
}

type ChartColorBulkProps = {
	data: ChartColorProps[];
};

/**
 * Syntax Sugar of ChartColor that allows to pass a list rather than creating one ChartColor for each color in the parent element
 * @param {ChartColorBulkProps} root0
 * @param {ChartColorProps[]} root0.data
 * @returns {JSX.Element}
 */
export function ChartColorBulk({ data }: ChartColorBulkProps): JSX.Element {
	return (
		<>
			{data.map((item, i) => (
				<ChartColor
					key={i}
					{...item}
				/>
			))}
		</>
	);
}
