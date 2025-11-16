import { Layout } from '@pages/_shared/Layout';
import { TournamentDetailsPage } from '@/modules/Tournaments/TournamentDetailsPage';

export default function TournamentDetails() {
	return (
		<Layout pageVariant='scrollable'>
			<TournamentDetailsPage />
		</Layout>
	);
}

