import { Skeleton } from './Skeleton.js';
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './Table.js';

interface TableLoadingProps {
	itemsPerPage?: number;
}

/**
 * TableLoading
 * @param {object} root0
 * @param {number} root0.itemsPerPage
 *
 * @returns {JSX.Element}
 */
export function TableLoading({ itemsPerPage }: TableLoadingProps) {
	return (
		<>
			<TableHeader>
				<TableRow>
					<TableHead className='p-0'>
						<Skeleton className='size-full' />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...Array(itemsPerPage ? itemsPerPage : 0)].map((_, index) => (
					<TableRow key={index}>
						<TableCell>
							<Skeleton className='size-full h-8' />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</>
	);
}
