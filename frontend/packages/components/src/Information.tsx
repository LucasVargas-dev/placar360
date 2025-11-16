import { Info } from 'phosphor-react';
import { ComponentPropsWithoutRef } from 'react';
import Tooltip from './Tooltip.js';

export type InformationSize = 'sm' | 'md' | 'lg';

export type InformationProps = {
	message: string;
	size?: InformationSize;
	zIndex?: number;
} & ComponentPropsWithoutRef<'div'>;

/**
 * Information component
 * Displays an information icon with a tooltip
 * @param {InformationProps} root0
 * @param {string} root0.message
 * @param {InformationSize} root0.size
 * @returns {JSX.Element}
 */
export function Information({
	message,
	size = 'md',
	zIndex,
}: InformationProps) {
	const iconSizes = {
		sm: 18,
		md: 22,
		lg: 26,
	};

	return (
		<div>
			<Tooltip
				content={message}
				zIndex={zIndex}
			>
				<Info
					size={iconSizes[size]}
					color='gray'
				/>
			</Tooltip>
		</div>
	);
}

export default Information;
