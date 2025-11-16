import { Layout } from '@pages/_shared/Layout';
import { TournamentCreatePage } from '@/modules/Tournaments/TournamentCreatePage';

export default function TournamentCreate() {
	return (
		<Layout pageVariant='scrollable'>
			<TournamentCreatePage />
		</Layout>
	);
}

