import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';

type ChartData = {
	name: string;
	value: number;
	color?: string;
};

type GeneralPieChartProps = {
	title?: string;
	data: ChartData[];
	value?: number;
	innerRadius?: number;
	outerRadius?: number;
	paddingAngle?: number;
	startAngle?: number;
	endAngle?: number;
	cx?: number | string;
	cy?: number | string;
	showTooltip?: boolean;
	showLegend?: boolean;
	showValue?: boolean;
};

/**
 * GeneralPieChart
 * @param {object} root0
 * @param {string} [root0.title]
 * @param {Array} root0.data
 * @param {number} [root0.value]
 * @param {number} [root0.innerRadius]
 * @param {number} [root0.outerRadius]
 * @param {number} [root0.paddingAngle]
 * @param {number} [root0.startAngle]
 * @param {number} [root0.endAngle]
 * @param {number | string} [root0.cx]
 * @param {number | string} [root0.cy]
 * @param {boolean} [root0.showTooltip]
 * @param {boolean} [root0.showLegend]
 * @param {boolean} [root0.showValue]
 *
 * @returns {JSX.Element}
 */
export function GeneralPieChart({
	title = '',
	data,
	value = 0,
	innerRadius = 0,
	outerRadius = 60,
	paddingAngle = 0,
	startAngle,
	endAngle,
	cx = '50%',
	cy = '50%',
	showTooltip = true,
	showLegend = true,
	showValue = false,
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

	return (
		<div className='flex-1 h-40'>
			{title && (
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
											gap: '5px 20px',
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
												<span style={{ fontSize: '0.875rem' }}>
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
						cx={cx}
						cy={cy}
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						paddingAngle={paddingAngle}
						startAngle={startAngle}
						endAngle={endAngle}
						labelLine={false}
						label={({ cx, cy }) =>
							showValue ? (
								<text
									x={cx}
									y={cy}
									textAnchor='middle'
									style={{
										fontSize: '20px',
										fontWeight: '600',
										fill: '#333',
									}}
								>
									{value.toFixed(1)}%
								</text>
							) : null
						}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.color || COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
