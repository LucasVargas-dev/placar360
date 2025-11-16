import { Star, MapPin, DollarSign, GraduationCap } from 'lucide-react';
import { Teacher } from '../types';

type ProfessorCardProps = {
	teacher: Teacher;
	onClick: () => void;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});

export function ProfessorCard({ teacher, onClick }: ProfessorCardProps) {
	const minPrice = Math.min(...teacher.locations.map(loc => loc.price));
	const maxPrice = Math.max(...teacher.locations.map(loc => loc.price));
	const priceRange =
		minPrice === maxPrice
			? currencyFormatter.format(minPrice)
			: `${currencyFormatter.format(minPrice)} - ${currencyFormatter.format(maxPrice)}`;

	const uniqueClubs = new Set(teacher.locations.map(loc => loc.clubName));
	const clubsCount = uniqueClubs.size;

	return (
		<button
			type='button'
			onClick={onClick}
			className='group flex h-full flex-col gap-5 rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-sm text-left transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300'
		>
			<div className='space-y-2'>
				<div className='flex items-start justify-between gap-2'>
					<div className='flex-1'>
						<h3 className='text-xl font-semibold text-gray-900'>{teacher.name}</h3>
						{teacher.rating && (
							<div className='mt-1 flex items-center gap-1'>
								<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
								<span className='text-sm font-medium text-gray-700'>
									{teacher.rating.toFixed(1)}
								</span>
							</div>
						)}
					</div>
				</div>

				<div className='flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700'>
					<GraduationCap className='h-3 w-3' />
					<span>{teacher.specialty}</span>
				</div>
			</div>

			{teacher.bio && (
				<p className='line-clamp-2 text-sm text-gray-600'>{teacher.bio}</p>
			)}

			<div className='mt-auto space-y-2 text-sm text-gray-600'>
				<div className='flex items-center gap-2'>
					<MapPin className='h-4 w-4 text-orange-500' />
					<span>
						{clubsCount} {clubsCount === 1 ? 'clube' : 'clubes'}
					</span>
				</div>

				<div className='flex items-center gap-2'>
					<DollarSign className='h-4 w-4 text-orange-500' />
					<span className='font-semibold text-gray-900'>{priceRange}</span>
				</div>
			</div>

			<div className='pt-2 border-t border-orange-100'>
				<span className='text-xs font-semibold text-orange-600 group-hover:text-orange-700'>
					Ver detalhes →
				</span>
			</div>
		</button>
	);
}

