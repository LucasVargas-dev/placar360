import clsx from 'clsx';
import { useState, useRef, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';
import { Container } from './Container.js';

interface GeneralGaugeChartProps {
	value: number;
	color?: string;
	title?: string;
	icon?: React.ReactNode;
	container?: boolean;
	dangerValue?: number;
	warningValue?: number;
}
/**
 * GeneralGaugeChart
 * @param {object} root0
 * @param {number} root0.value
 * @param {string} root0.color
 * @param {string} root0.title
 * @param {React.ReactNode} root0.icon
 * @param {boolean} root0.container
 * @param {number} root0.dangerValue
 * @param {number} root0.warningValue
 *
 * @returns {JSX.Element}
 */
export function GeneralGaugeChart({
	value,
	color,
	title,
	icon,
	container = true,
	dangerValue = 30,
	warningValue = 70,
}: GeneralGaugeChartProps) {
	/**
	 * variableColor
	 * @param {number} val
	 *
	 * @returns {string}
	 */
	const variableColor = (val: number) => {
		if (val < dangerValue) {
			return 'text-danger-700';
		} else if (val < warningValue) {
			return 'text-warning-700';
		} else {
			return 'text-success-700';
		}
	};

	const [colors, setColors] = useState({
		labelText: '',
		filled: '',
		empty: '',
	});
	const [displayValue, setDisplayValue] = useState(value);
	const [currentColorClass, setCurrentColorClass] = useState(
		color ?? variableColor(value)
	);
	const refs = {
		labelText: useRef<HTMLDivElement>(null),
		filled: useRef<HTMLDivElement>(null),
		empty: useRef<HTMLDivElement>(null),
	};

	useEffect(() => {
		/**
		 * updateColors
		 */
		const updateColors = () => {
			requestAnimationFrame(() => {
				setColors({
					labelText: getComputedStyle(refs.labelText.current!).backgroundColor,
					filled: getComputedStyle(refs.filled.current!).color,
					empty: getComputedStyle(refs.empty.current!).color,
				});
			});
		};

		updateColors();

		const observer = new MutationObserver(updateColors);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => observer.disconnect();
	}, [currentColorClass]);

	// Animar o valor do display quando o value muda
	useEffect(() => {
		const startTime = performance.now();
		const startValue = displayValue;
		const targetValue = value;
		const difference = targetValue - startValue;
		const duration = Math.abs(difference * 30); // Duração da animação em ms ajustada para ser variavel de acordo com a diferença

		/**
		 * animate
		 * @param {number} currentTime
		 */
		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Faz com que a animação seja mais lenta no inicio e fim
			const easedProgress =
				progress === 1
					? 1
					: progress < 0.5
						? 2 * progress * progress
						: -2 * progress ** 2 + 4 * progress - 1;

			const currentValue = startValue + difference * easedProgress;
			setDisplayValue(currentValue);

			const animatedColorClass = color ?? variableColor(currentValue);
			setCurrentColorClass(animatedColorClass);

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	}, [value, color]);

	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [fontSize, setFontSize] = useState(20);
	const [chartDimensions, setChartDimensions] = useState({
		width: 200,
		height: 200,
		radius: 80,
	});

	useEffect(() => {
		/**
		 * updateDimensions
		 */
		const updateDimensions = () => {
			if (chartContainerRef.current) {
				const { width, height } =
					chartContainerRef.current.getBoundingClientRect();

				// Para um gauge semicircular, a altura efetiva é metade da largura
				// Então precisamos garantir que o diâmetro caiba tanto na largura quanto na altura*2
				const maxDiameter = Math.min(width, height * 2);

				// Deixa uma margem de segurança
				const diameter = maxDiameter * 0.9;
				const radius = diameter / 4; // innerRadius será 100% e outerRadius será 200%, então o raio efetivo é diameter/4

				setChartDimensions({
					width: diameter,
					height: diameter / 2, // Altura é metade para um semicírculo
					radius: radius,
				});

				// Calcula o fontSize baseado no tamanho do gráfico
				const calculatedFontSize = Math.max(12, diameter * 0.1);
				setFontSize(calculatedFontSize);
			}
		};

		const resizeObserver = new ResizeObserver(updateDimensions);
		if (chartContainerRef.current) {
			resizeObserver.observe(chartContainerRef.current);
		}

		updateDimensions();

		return () => resizeObserver.disconnect();
	}, []);

	// Usar useMemo para evitar recriação desnecessária dos dados
	const data = useMemo(
		() => [
			{
				name: 'filled',
				value: displayValue,
				color: colors.filled,
			},
			{
				name: 'empty',
				value: 100 - displayValue,
				color: colors.empty,
			},
		],
		[displayValue, colors.filled, colors.empty]
	);

	const chartContent = (
		<div
			ref={chartContainerRef}
			className='flex-1 flex flex-col items-center justify-center h-full w-full relative'
		>
			<div
				className='flex items-end justify-center'
				style={{
					width: `${chartDimensions.width}px`,
					height: `${chartDimensions.height}px`,
				}}
			>
				<PieChart
					width={chartDimensions.width}
					height={chartDimensions.height}
				>
					<Pie
						isAnimationActive={true}
						animationBegin={0}
						animationDuration={500}
						animationEasing='ease-in-out'
						data={data}
						startAngle={180}
						endAngle={0}
						innerRadius='100%'
						outerRadius='200%'
						dataKey='value'
						cx='50%'
						cy='100%'
						labelLine={false}
					>
						{data.map(entry => (
							<Cell
								key={entry.name}
								fill={entry.color}
								stroke='none'
							/>
						))}
						<Label
							style={{
								fontSize: `${fontSize}px`,
								fontWeight: '600',
								fill: colors.labelText,
								transition: 'color 0.3s ease-in-out',
							}}
							value={`${displayValue.toFixed(1)}%`}
							position='center'
							dy={-chartDimensions.radius * 0.2}
						/>
					</Pie>
				</PieChart>
			</div>
		</div>
	);

	return (
		<div className={clsx('flex flex-col h-full w-full')}>
			<div
				ref={refs.labelText}
				className='hidden bg-black dark:bg-white'
			/>
			<div
				ref={refs.filled}
				className={clsx('hidden', currentColorClass)}
			/>
			<div
				ref={refs.empty}
				className='hidden text-secondary-500'
			/>

			{container ? (
				<Container
					title={title || ''}
					icon={icon}
					variant='elevated'
					className='h-full'
				>
					{chartContent}
				</Container>
			) : (
				chartContent
			)}
		</div>
	);
}
