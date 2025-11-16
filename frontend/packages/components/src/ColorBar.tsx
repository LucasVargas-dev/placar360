type ColorBarProps = {
	success: number;
	warning: number;
	danger: number;
};

/**
 * Colorbar
 * @param {object} root0
 * @param {number} root0.success
 * @param {number} root0.warning
 * @param {number} root0.danger
 *
 * @returns {JSX.Element}
 */
export function ColorBar({ success, warning, danger }: ColorBarProps) {
	return (
		<div className='relative flex w-full h-4 rounded overflow-hidden'>
			<div
				className='bg-success-700'
				style={{ width: `${success}%` }}
			/>
			<div
				className='bg-warning-700'
				style={{ width: `${warning}%` }}
			/>
			<div
				className='bg-danger-700'
				style={{ width: `${danger}%` }}
			/>
			<div className='absolute inset-0 flex justify-center items-center text-md font-semibold text-white'>
				{success}%
			</div>
		</div>
	);
}
