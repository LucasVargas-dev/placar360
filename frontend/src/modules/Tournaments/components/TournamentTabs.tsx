import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export type TournamentTabKey = 'participants' | 'brackets' | 'registration' | 'matches';

export type TournamentTab = {
	key: TournamentTabKey;
	label: string;
	icon: LucideIcon;
};

type TournamentTabsProps = {
	tabs: readonly TournamentTab[];
	activeTab: TournamentTabKey;
	onTabChange: (tab: TournamentTabKey) => void;
};

export function TournamentTabs({ tabs, activeTab, onTabChange }: TournamentTabsProps) {
	return (
		<div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
			{tabs.map(tab => {
				const Icon = tab.icon;
				const isActive = tab.key === activeTab;
				return (
					<button
						key={tab.key}
						type='button'
						onClick={() => onTabChange(tab.key)}
						className={clsx(
							'flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all',
							'border-orange-500 bg-white text-gray-900 hover:bg-orange-50',
							{
								'bg-orange-50 text-orange-700 shadow-inner': isActive,
							}
						)}
					>
						<Icon className='h-4 w-4 text-orange-500' />
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}

