import { Layout } from '@pages/_shared/Layout';
import { LessonsPage } from '@/modules/Lessons/LessonsPage';

export default function Lessons() {
	return (
		<Layout pageVariant='scrollable'>
			<LessonsPage />
		</Layout>
	);
}

