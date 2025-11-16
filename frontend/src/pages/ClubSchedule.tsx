import { Layout } from '@pages/_shared/Layout';
import { ClubSchedulePage } from '@/modules/ClubSchedule/ClubSchedulePage';

export default function ClubSchedule() {
	return (
		<Layout pageVariant='scrollable'>
			<ClubSchedulePage />
		</Layout>
	);
}



