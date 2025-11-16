import { useEffect, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import { Container } from './Container.js';
import type { ApexOptions } from 'apexcharts';

type ChartData = {
	entityName: string;
	events: {
		type: string;
		start: string;
		end: string;
	}[];
};

type GeneralTimelineChartProps = {
	title?: string;
	icon?: React.ReactNode;
	data: ChartData[];
	container?: boolean;
	showEntityNames?: boolean;
};

/**
 * GeneralTimelineChart
 * @param {object} root0
 * @param {string} root0.title
 * @param {ReactNode} root0.icon
 * @param {ChartData[]} root0.data
 * @param {boolean} root0.container
 * @param {boolean} root0.showEntityNames
 *
 * @returns {JSX.Element}
 */
export const GeneralTimelineChart = ({
	title,
	icon,
	data,
	container = true,
	showEntityNames = true,
}: GeneralTimelineChartProps) => {
	const [apexColors, setApexColors] = useState({
		bg: '',
		text: '',
		grid: '',
		tooltipBg: '',
		tooltipText: '',
		legendText: '',
	});

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setIsReady(true);
	}, []);

	const colorRefs = {
		bg: useRef<HTMLDivElement>(null),
		text: useRef<HTMLDivElement>(null),
		grid: useRef<HTMLDivElement>(null),
		tooltipBg: useRef<HTMLDivElement>(null),
		tooltipText: useRef<HTMLDivElement>(null),
		legendText: useRef<HTMLDivElement>(null),
	};

	useEffect(() => {
		/**
		 * Update colors
		 */
		const updateColors = () => {
			setApexColors({
				bg: getComputedStyle(colorRefs.bg.current!).backgroundColor,
				text: getComputedStyle(colorRefs.text.current!).color,
				grid: getComputedStyle(colorRefs.grid.current!).backgroundColor,
				tooltipBg: getComputedStyle(colorRefs.tooltipBg.current!)
					.backgroundColor,
				tooltipText: getComputedStyle(colorRefs.tooltipText.current!).color,
				legendText: getComputedStyle(colorRefs.legendText.current!).color,
			});
		};

		updateColors();
		const observer = new MutationObserver(updateColors);
		observer.observe(document.documentElement, { attributes: true });
		return () => observer.disconnect();
	}, []);

	const eventTypes = Array.from(
		new Set(data.flatMap(e => e.events.map(ev => ev.type)))
	);

	const series = eventTypes.map(type => ({
		name: type,
		data: data.flatMap(entity =>
			entity.events
				.filter(event => event.type === type)
				.map(event => ({
					x: entity.entityName,
					y: [new Date(event.start).getTime(), new Date(event.end).getTime()],
				}))
		),
	}));

	const options: ApexOptions = {
		chart: {
			type: 'rangeBar',
			background: apexColors.bg,
			foreColor: apexColors.text,
			toolbar: { show: false },
			zoom: { enabled: false },
			animations: { enabled: false },
		},
		plotOptions: {
			bar: {
				horizontal: true,
				rangeBarGroupRows: true,
				opacity: 1,
			},
		},
		xaxis: {
			type: 'datetime',
			labels: {
				datetimeUTC: false,
				/**
				 * Custom formatter
				 * @param {number} value
				 * @returns {string}
				 */
				formatter: (value: number) => {
					const date = new Date(value);
					return date.toLocaleString('pt-BR', {
						hour: '2-digit',
						minute: '2-digit',
					});
				},
				style: {
					colors: apexColors.text,
					fontSize: '14px',
				},
				offsetX: 20,
			},
			axisBorder: {
				show: true,
				color: apexColors.text,
			},
			axisTicks: {
				show: true,
				color: apexColors.text,
				width: 1,
			},
		},
		yaxis: {
			labels: {
				show: showEntityNames,
				style: {
					colors: apexColors.text,
					fontSize: '16px',
				},
			},
		},
		tooltip: {
			theme: 'custom',
			style: {
				fontSize: '12px',
				color: apexColors.tooltipText,
			},
			/**
			 * Custom tooltip
			 * @param {object} root0
			 * @param {number} root0.seriesIndex
			 * @param {number} root0.dataPointIndex
			 * @param {object} root0.w
			 * @returns {string}
			 */
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			custom: ({ seriesIndex, dataPointIndex, w }: any) => {
				const serie = w.globals.initialSeries[seriesIndex];
				const data = serie.data[dataPointIndex];
				const start = new Date(data.y[0]).toLocaleString('pt-BR');
				const end = new Date(data.y[1]).toLocaleString('pt-BR');
				return `<div style="background:${apexColors.tooltipBg};color:${apexColors.tooltipText};padding:8px;border-radius:4px">
          <strong>${serie.name}</strong><br/>
          Start: ${start}<br/>
          End: ${end}
        </div>`;
			},
		},
		grid: {
			borderColor: apexColors.grid,
		},
		legend: {
			labels: {
				colors: apexColors.legendText,
			},
			markers: {
				strokeWidth: 0,
				offsetX: -3,
			},
		},
		fill: {
			type: 'solid',
			opacity: 1,
		},
		colors: [
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
		],
	};

	return (
		<>
			{/* Hidden elements to extract Tailwind styles */}
			<div className='hidden'>
				<div
					ref={colorRefs.bg}
					className='bg-transparent dark:bg-transparent'
				/>
				<div
					ref={colorRefs.text}
					className='text-secondary-1100 dark:text-secondary-500'
				/>
				<div
					ref={colorRefs.grid}
					className='bg-secondary-1100 dark:bg-primary-400'
				/>
				<div
					ref={colorRefs.tooltipBg}
					className='bg-primary-700 dark:bg-primary-700'
				/>
				<div
					ref={colorRefs.tooltipText}
					className='text-white  dark:text-white'
				/>
				<div
					ref={colorRefs.legendText}
					className='text-zinc-600 dark:text-zinc-300'
				/>
			</div>

			{isReady &&
				(container ? (
					<div className='w-full h-full flex flex-col'>
						<Container
							title={title || ''}
							icon={icon}
							className='h-full flex flex-col'
							variant='elevated'
						>
							{/* @ts-ignore */}
							<Chart
								options={options}
								series={series}
								type='rangeBar'
								height={'100%'}
							/>
						</Container>
					</div>
				) : (
					<>
						{/* @ts-ignore */}
						<Chart
							options={options}
							series={series}
							type='rangeBar'
							height={'100%'}
						/>
					</>
				))}
		</>
	);
};
