import React, { useEffect, useRef, useState } from 'react';
import {
	Bar,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
	ComposedChart,
} from 'recharts';
import { Container } from './Container.js';

type ChartData = {
	name: string;
	[key: string]: string | number;
};

type XAxisDefinition = {
	dataKey: string;
	type?: 'number' | 'category';
};

type YAxisDefinition = {
	orientation: 'left' | 'right';
	width?: number;
	domain?: [number, number];
	tickFormatter?: (value: number) => string;
	tickCount?: number;
};

type TooltipDefinition = {}; //investigar posteriormente

type BarDefinition = {
	dataKey: string;
	label?: string;
	colorClassName?: string;
	yAxisId: 'left' | 'right';
};

type LineDefinition = {
	dataKey: string;
	label?: string;
	colorClassName?: string;
	yAxisId: 'left' | 'right';
};

type GeneralBarLineChartProps = {
	title?: string;
	icon?: React.ReactNode;
	data: ChartData[];
	xAxis: XAxisDefinition;
	yAxes: YAxisDefinition[];
	bars?: BarDefinition[];
	lines?: LineDefinition[];
	tooltip?: TooltipDefinition[];
	container?: boolean;
};

/**
 * GeneralBarLineChart
 * @param {string} root0
 * @param {string} root0.title
 * @param {React.ReactNode} root0.icon
 * @param {ChartData[]} root0.data
 * @param {XAxisDefinition} root0.xAxis
 * @param {YAxisDefinition[]} root0.yAxes
 * @param {BarDefinition[]} root0.bars
 * @param {LineDefinition[]} root0.lines
 *
 * @returns {JSX.Element}
 */
export function GeneralBarLineChart({
	title,
	icon,
	data,
	xAxis,
	yAxes,
	bars,
	lines,
	container = true,
}: GeneralBarLineChartProps): JSX.Element {
	const [colors, setColors] = useState({
		grid: '',
		axis: '',
		tick: '',
		tooltipBg: '',
		tooltipCartesianBg: '',
		tooltipText: '',
	});
	const [barColors, setBarColors] = useState<string[]>([]);
	const [lineColors, setLineColors] = useState<string[]>([]);

	const refs = {
		grid: useRef<HTMLDivElement>(null),
		axis: useRef<HTMLDivElement>(null),
		tick: useRef<HTMLDivElement>(null),
		tooltip: useRef<HTMLDivElement>(null),
		tooltipCartesianBg: useRef<HTMLDivElement>(null),
		barColors: useRef<HTMLDivElement[]>([]),
		lineColors: useRef<HTMLDivElement[]>([]),
	};

	useEffect(() => {
		/**
		 * Updates bars and lines colors
		 */
		const updateColors = () => {
			setColors({
				grid: getComputedStyle(refs.grid.current!).backgroundColor,
				axis: getComputedStyle(refs.axis.current!).color,
				tick: getComputedStyle(refs.tick.current!).color,
				tooltipBg: getComputedStyle(refs.tooltip.current!).backgroundColor,
				tooltipCartesianBg: getComputedStyle(refs.tooltipCartesianBg.current!)
					.color,
				tooltipText: getComputedStyle(refs.tooltip.current!).color,
			});

			const newBarColors = refs.barColors.current.map(
				ref => ref && getComputedStyle(ref).backgroundColor
			);
			setBarColors(newBarColors);

			const newLineColors = refs.lineColors.current.map(
				ref => ref && getComputedStyle(ref).backgroundColor
			);
			setLineColors(newLineColors);
		};

		updateColors();
		const observer = new MutationObserver(updateColors);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});
		return () => observer.disconnect();
	}, [bars?.length, lines?.length]);

	const chart = (
		<ResponsiveContainer
			width='100%'
			height='100%'
		>
			<ComposedChart
				data={data}
				margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
			>
				<CartesianGrid
					stroke={colors.grid}
					strokeDasharray='3 3'
				/>
				<XAxis
					dataKey={xAxis.dataKey}
					type={xAxis.type ?? 'category'}
					stroke={colors.axis}
					tick={{ fill: colors.tick }}
				/>
				{yAxes?.map((yAxis, index) => (
					<YAxis
						key={index}
						yAxisId={yAxis.orientation}
						orientation={yAxis.orientation}
						width={yAxis.width}
						domain={yAxis.domain}
						tickFormatter={yAxis.tickFormatter}
						tickCount={yAxis.tickCount}
						stroke={colors.axis}
						tick={{ fill: colors.tick }}
					/>
				))}
				<Tooltip
					contentStyle={{
						backgroundColor: colors.tooltipBg,
						border: 'none',
						borderRadius: '6px',
					}}
					labelStyle={{ color: colors.tooltipText }}
					itemStyle={{ color: colors.tooltipText }}
					cursor={{ fill: colors.tooltipCartesianBg }}
				/>
				<Legend />
				{bars?.map((bar, index) => (
					<Bar
						key={bar.dataKey}
						yAxisId={bar.yAxisId}
						dataKey={bar.dataKey}
						fill={barColors[index] ?? '#ccc'}
						animationDuration={300}
						barSize={16}
						radius={[4, 4, 0, 0]}
						name={bar.label}
					/>
				))}
				{lines?.map((line, index) => (
					<Line
						type='monotone'
						key={line.dataKey}
						yAxisId={line.yAxisId}
						dataKey={line.dataKey}
						stroke={lineColors[index] ?? '#ccc'}
						strokeWidth={2}
						dot={{ r: 3 }}
						activeDot={{ r: 4 }}
						animationDuration={300}
						name={line.label}
					/>
				))}
			</ComposedChart>
		</ResponsiveContainer>
	);

	return (
		<>
			<div
				ref={refs.grid}
				className='hidden bg-secondary-500 dark:bg-primary-400'
			/>
			<div
				ref={refs.axis}
				className='hidden text-secondary-1100 dark:text-secondary-500'
			/>
			<div
				ref={refs.tick}
				className='hidden text-secondary-1100 dark:text-secondary-500'
			/>
			<div
				ref={refs.tooltip}
				className='hidden bg-primary-700 text-white dark:bg-primary-700 dark:text-white'
			/>
			<div
				ref={refs.tooltipCartesianBg}
				className='hidden text-secondary-300 dark:text-primary-400'
			/>

			{bars?.map((bar, index) => (
				<div
					key={index}
					ref={el => {
						if (el) refs.barColors.current[index] = el;
					}}
					className={`hidden ${bar.colorClassName ?? 'bg-primary-700 dark:bg-primary-300'}`}
				/>
			))}

			{lines?.map((line, index) => (
				<div
					key={index}
					ref={el => {
						if (el) refs.lineColors.current[index] = el;
					}}
					className={`hidden ${line.colorClassName ?? 'bg-primary-700 dark:bg-primary-300'}`}
				/>
			))}

			{container ? (
				<Container
					title={title || ''}
					icon={icon}
					className='h-full'
					variant='elevated'
					contentClassName='p-4'
				>
					{chart}
				</Container>
			) : (
				chart
			)}
		</>
	);
}
