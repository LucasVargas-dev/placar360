import { CaretDoubleDown, CaretDoubleUp, Equals } from 'phosphor-react';

interface TotalizerProps {
	value: number | string;
	unit?: string;
	trend?: number;
}
/**
 * Totalizer
 * @param {object} root0
 * @param {number} root0.trend
 * @param {number | string} root0.value
 * @param {string} root0.unit
 *
 * @returns {JSX.Element}
 */
export function Totalizer({ trend, value, unit }: TotalizerProps) {
	let icon = null;
	if (trend) {
		const isPositive = trend > 0;
		const isNegative = trend < 0;

		icon = isPositive ? (
			<CaretDoubleUp
				size={32}
				weight='bold'
				className='text-green-500'
			/>
		) : isNegative ? (
			<CaretDoubleDown
				size={32}
				weight='bold'
				className='text-red-500'
			/>
		) : (
			<Equals
				size={28}
				weight='bold'
				className='text-gray-500'
			/>
		);
	}
	return (
		<div className='h-full w-full flex-1 flex items-center justify-center'>
			<div className='flex items-end'>
				<div className='self-center'>{icon}</div>
				<h1 className='text-4xl text-black dark:text-white'>{value}</h1>
				{unit && (
					<h3 className='text-md text-black dark:text-white mb-2'>
						&nbsp;{unit}
					</h3>
				)}
			</div>
		</div>
	);
}
