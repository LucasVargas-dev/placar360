import { Layout } from '@pages/_shared/Layout';
import { ClubPage } from '@/modules/Club/ClubPage';

export default function Clubs() {
	return (
		<Layout pageVariant='scrollable'>
			<ClubPage />
		</Layout>
	);
}
