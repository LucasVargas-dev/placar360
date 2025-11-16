import { TooltipProps } from 'recharts';

export type CustomTooltipHandler = (
	data: Record<string, unknown>
) => [label: string, value: string][];

type CustomTooltipProps = TooltipProps<number, string> & {
	handler: CustomTooltipHandler;
};

/**
 * Custom tooltip component using Tailwind classes
 * @param {undefined} root0
 * @param {undefined} root0.active
 * @param {undefined} root0.payload
 * @param {undefined} root0.label
 * @param {undefined} root0.contentStyle
 * @param {undefined} root0.labelStyle
 * @param {undefined} root0.itemStyle
 * @param {undefined}root0.wrapperStyle
 * @returns {JSX.Element}
 */
export function CustomTooltip({
	active,
	payload,
	contentStyle,
	itemStyle,
	handler,
}: CustomTooltipProps): JSX.Element | null {
	if (!active || !payload || payload.length === 0) {
		return null;
	}

	const data = payload[0].payload as Record<string, unknown>;

	return (
		<div
			style={contentStyle}
			className='p-2 flex flex-col gap-1'
		>
			{handler(data).map(
				([label, value], i) =>
					value && (
						<div
							key={i}
							style={itemStyle}
							className='flex flex-row gap-1'
						>
							<p>{label}:</p>
							<p className='font-bold'>{value}</p>
						</div>
					)
			)}
		</div>
	);
}

export default CustomTooltip;

// Usage example:
/*
<ScatterChart width={600} height={400} data={data}>
  <XAxis dataKey="x" />
  <YAxis dataKey="y" />
  <Tooltip content={<CustomTooltip />} />
  <Scatter fill="#8884d8" />
</ScatterChart>
*/
