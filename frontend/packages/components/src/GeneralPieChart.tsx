import { useEffect, useRef, useState } from 'react';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';
import clsx from 'clsx';
import { Container } from './Container.js';

type ChartData = {
	name: string;
	value: number;
	color?: string;
};

type GeneralPieChartProps = {
	title?: string;
	data: ChartData[];
	innerRadius?: number | string;
	outerRadius?: number | string;
	showTooltip?: boolean;
	showLegend?: boolean;
	container?: boolean;
	icon?: React.ReactNode;
};

/**
 * GeneralPieChart
 * @param {object} root0
 * @param {string} root0.title
 * @param {Array} root0.data
 * @param {boolean} root0.showTooltip
 * @param {boolean} root0.showLegend
 * @param {number | string} root0.innerRadius
 * @param {number | string} root0.outerRadius
 * @param {boolean} root0.container
 * @param {React.ReactNode} root0.icon
 *
 * @returns {JSX.Element}
 */
export function GeneralPieChart({
	title,
	data,
	showTooltip = true,
	showLegend = true,
	innerRadius = '50%',
	outerRadius = '80%',
	container = true,
	icon,
}: GeneralPieChartProps): JSX.Element {
	const COLORS = [
		'#7D83A0',
		'#0E2E3E',
		'#A4C0D4',
		'#123343',
		'#6B97B3',
		'#234457',
		'#A4A9BE',
		'#365F7D',
		'#B0B4C6',
		'#44789B',
		'#BBBFCE',
		'#D9DBE3',
	];
	const [legendColor, setLegendColor] = useState<string>();

	const refs = {
		legendColor: useRef<HTMLDivElement>(null),
	};

	useEffect(() => {
		/**
		 * updateColors
		 */
		const updateColors = () => {
			setLegendColor(getComputedStyle(refs.legendColor.current!).color);
		};

		updateColors();

		const observer = new MutationObserver(updateColors);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [fontSize, setFontSize] = useState(20);

	useEffect(() => {
		/**
		 * updateFontSize
		 */
		const updateFontSize = () => {
			if (chartContainerRef.current) {
				const { width, height } =
					chartContainerRef.current.getBoundingClientRect();
				const base = Math.min(width, height);
				const calculatedFontSize = base * 0.055;
				setFontSize(calculatedFontSize);
			}
		};

		const resizeObserver = new ResizeObserver(updateFontSize);
		if (chartContainerRef.current) {
			resizeObserver.observe(chartContainerRef.current);
		}

		updateFontSize();

		return () => resizeObserver.disconnect();
	}, []);

	const chartContent = (
		<div
			ref={chartContainerRef}
			className='flex-1 h-full w-full'
		>
			<div
				ref={refs.legendColor}
				className='hidden text-black dark:text-white'
			></div>
			{title && !container && (
				<h2 className='text-xl font-semibold mb-1 text-center'>{title}</h2>
			)}
			<ResponsiveContainer
				width='100%'
				height='100%'
			>
				<PieChart>
					{showTooltip && <Tooltip />}
					{showLegend && (
						<Legend
							layout='horizontal'
							verticalAlign='bottom'
							align='center'
							content={({ payload }) => (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										marginTop: '10px',
									}}
								>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(2, max-content)',
											gap: '5px 10px',
										}}
									>
										{payload?.map((entry, index) => (
											<div
												key={`item-${index}`}
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '6px',
												}}
											>
												<div
													style={{
														width: 12,
														height: 12,
														backgroundColor: entry.color,
														borderRadius: '50%',
													}}
												/>
												<span
													style={{
														fontSize: `${fontSize}px`,
														color: legendColor,
													}}
												>
													{`${entry.value} - ${entry.payload?.value}%`}
												</span>
											</div>
										))}
									</div>
								</div>
							)}
						/>
					)}
					<Pie
						data={data}
						dataKey='value'
						nameKey='name'
						cx='50%'
						cy='50%'
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						paddingAngle={0}
						labelLine={false}
					>
						{data.map((entry, index) => (
							<Cell
								stroke='none'
								key={`cell-${index}`}
								fill={entry.color || COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);

	return (
		<div
			className={clsx(
				'flex flex-col h-full w-full',
				container && 'bg-white dark:bg-primary-500 shadow-lg'
			)}
		>
			{container ? (
				<Container
					title={title || ''}
					icon={icon}
					className='h-full'
					variant='elevated'
				>
					{chartContent}
				</Container>
			) : (
				chartContent
			)}
		</div>
	);
}
