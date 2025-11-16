import {
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { ScaleType } from 'recharts/types/util/types.js';
import { ChartColorBulk, ChartColorProps } from './ChartColor.js';
import { useEffect, useState } from 'react';
import CustomTooltip, { CustomTooltipHandler } from './CustomTooltip.js';

type XAxisDefinition = {
	dataKey: string;
	type?: 'number' | 'category';
	domain?:
		| string[]
		| number[]
		| ((
				[dataMin, dataMax]: [number, number],
				allowDataOverflow: boolean
		  ) => [number, number]);
	tickFormatter?: (value: unknown, index: number) => string;
	scale?: ScaleType;
	tickCount?: number;
};

type YAxisDefinition = {
	dataKey: string;
	orientation: 'left' | 'right';
	id?: string;
	width?: number;
	domain?: [number, number];
	tickFormatter?: (value: number) => string;
	tickCount?: number;
	unit?: string;
	type?: 'category' | 'number';
};

type ScatterDefinition = {
	axisId: string;
	data: ScatterChartData;
	colorClassName?: string; // Applies only to background colors
};

type ScatterChartData = {
	name: string;
	items: Record<string, unknown>[];
};

type ScatterChartProps = {
	scatters: ScatterDefinition[];
	xAxis: XAxisDefinition;
	yAxes: YAxisDefinition[];
	tooltipValues?: string[];
	customTooltipHandler?: CustomTooltipHandler;
};

/**
 * GeneralScatterChart
 * @param {ScatterChartProps} root0
 *
 * @returns {JSX.Element}
 */
export function GeneralScatterChart({
	scatters,
	xAxis,
	yAxes,
	customTooltipHandler,
}: ScatterChartProps): JSX.Element {
	const [tooltip, setTooltip] = useState({ bgColor: '', color: '' });
	const [tooltipCartesian, setTooltipCartesian] = useState({
		bgColor: '',
		color: '',
	});
	const [gridColor, setGridColor] = useState({
		bgColor: '',
		color: '',
	});
	const [tickColor, setTickColor] = useState({
		bgColor: '',
		color: '',
	});
	const [axisColor, setAxisColor] = useState({
		bgColor: '',
		color: '',
	});
	const [scatterColors, setScatterColors] = useState(
		scatters.map(() => ({
			bgColor: '',
			color: '',
		}))
	);
	const [colors] = useState([
		'bg-primary-100',
		'bg-primary-200',
		'bg-primary-300',
		'bg-primary-400',
		'bg-primary-500',
		'bg-primary-700',
		'bg-primary-800',
		'bg-primary-900',
	]);

	useEffect(() => {
		setScatterColors(prevColors => {
			const newColors = scatters.map((_, index) => {
				return prevColors[index] || { bgColor: '', color: '' };
			});
			return newColors;
		});
	}, [scatters.length]);

	return (
		<div className='h-full flex flex-col bg-white dark:bg-primary-500'>
			<ChartColorBulk
				data={[
					{
						onChange: setTooltip,
						color: 'text-white dark:text-white',
						bgColor: 'bg-primary-700 dark:bg-primary-700',
					},
					{
						onChange: setTooltipCartesian,
						color: 'text-secondary-300 dark:text-primary-400',
					},
					{
						onChange: setGridColor,
						color: 'hidden bg-secondary-500 dark:bg-primary-400',
					},
					{
						onChange: setTickColor,
						color: 'hidden text-secondary-1100 dark:text-secondary-500',
					},
					{
						onChange: setAxisColor,
						color: 'hidden text-primary-1100 dark:text-secondary-500',
					},
					...scatters.map(
						(scatter, i): ChartColorProps => ({
							/**
							 * Changes the color the i scatter
							 * @param {object} data
							 * @returns {void}
							 */
							onChange: (data): void =>
								setScatterColors(previous =>
									previous.map((item, j) => (j == i ? { ...data } : item))
								),
							bgColor:
								scatter.colorClassName ??
								// if no color was chossen, alternates between the first and last predefined colors
								colors[
									i % 2 == 0
										? (i % colors.length) / 2
										: colors.length - Math.floor((i % colors.length) / 2) - 1
								],
						})
					),
				]}
			/>

			<div className='flex-1 p-6'>
				<ResponsiveContainer
					width='100%'
					height={400}
				>
					<ScatterChart>
						<CartesianGrid
							stroke={gridColor.bgColor}
							strokeDasharray='3 3'
						/>
						<XAxis
							dataKey={xAxis.dataKey}
							type={xAxis.type ?? 'category'}
							stroke={axisColor.color}
							tick={{ fill: tickColor.color }}
							domain={xAxis.domain}
							tickFormatter={xAxis.tickFormatter}
							scale={xAxis.scale}
							ticks={(() => {
								if (xAxis.type != 'number' || !xAxis.tickCount) return;
								const values = scatters
									.map(scatter =>
										scatter.data.items.map(
											item => item[xAxis.dataKey] as number
										)
									)
									.flat();
								const min = Math.min(...values);
								const max = Math.max(...values);
								const tickLenght = (max - min) / xAxis.tickCount;
								const ticks: number[] = [];
								for (let i = 0; i <= xAxis.tickCount; i++)
									ticks.push(min + tickLenght * i);
								return ticks;
							})()}
						/>
						{yAxes.map((yAxis, i) => (
							<YAxis
								key={i}
								yAxisId={yAxis.orientation}
								orientation={yAxis.orientation}
								width={yAxis.width}
								domain={yAxis.domain}
								unit={yAxis.unit}
								tickFormatter={yAxis.tickFormatter}
								tickCount={yAxis.tickCount}
								type={yAxis.type}
								dataKey={yAxis.dataKey}
								stroke={axisColor.color}
								tick={{ fill: tickColor.color }}
							/>
						))}

						<Tooltip
							contentStyle={{
								backgroundColor: tooltip.bgColor,
								border: 'none',
								borderRadius: '6px',
							}}
							labelStyle={{ color: tooltip.color }}
							itemStyle={{ color: tooltip.color }}
							cursor={{
								fill: tooltipCartesian.color,
								strokeDasharray: '3 3',
							}}
							content={
								customTooltipHandler && (
									<CustomTooltip handler={customTooltipHandler} />
								)
							}
						/>
						<Legend />

						{scatters.map((scatter, i) => (
							<Scatter
								key={i}
								name={scatter.data.name}
								data={scatter.data.items}
								yAxisId={scatter.axisId}
								fill={scatterColors[i].bgColor || '#ccc'}
								line
								shape='circle'
								animationDuration={200}
								strokeWidth={2}
							/>
						))}
					</ScatterChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
