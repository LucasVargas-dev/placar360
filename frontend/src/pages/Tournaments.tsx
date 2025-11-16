import { Layout } from '@pages/_shared/Layout';
import { TournamentsPage } from '@/modules/Tournaments/TournamentsPage';

export default function Tournaments() {
	return (
		<Layout pageVariant='scrollable'>
			<TournamentsPage />
		</Layout>
	);
}

