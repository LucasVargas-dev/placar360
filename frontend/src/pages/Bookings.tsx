import { CalendarDays, ClipboardList, Clock } from 'lucide-react';
import { Layout } from '@pages/_shared/Layout';
import { Container, InfoCard, Button } from '@packages/components';
import { Link } from 'react-router-dom';

export default function Bookings() {
	return (
		<Layout pageVariant='scrollable'>
			<div className='flex flex-col gap-6'>
				<Container
					title='Reservas'
					icon={<CalendarDays className='h-5 w-5 text-orange-500' />}
					borderRadius='lg'
					className='shadow-sm'
					contentClassName='p-6 space-y-6'
				>
					<div className='space-y-4'>
						<p className='text-secondary-700 text-base'>
							Estamos migrando o módulo de reservas para o novo padrão de layout.
							Em breve você poderá visualizar e gerenciar a agenda das quadras por aqui.
						</p>
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
							<InfoCard
								title='Agenda visual'
								description='Veja a ocupação das quadras com filtros por clube, data e modalidade.'
								icon={<Clock className='h-5 w-5' />}
							/>
							<InfoCard
								title='Gestão centralizada'
								description='Crie, edite e cancele reservas com notificações automáticas.'
								icon={<ClipboardList className='h-5 w-5' />}
							/>
							<InfoCard
								title='Integração com clubes'
								description='Sincronize reservas com o cadastro de clubes e quadras em tempo real.'
								icon={<CalendarDays className='h-5 w-5' />}
							/>
						</div>
					</div>

					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-secondary-200 pt-4'>
						<div className='space-y-1'>
							<h3 className='text-lg font-semibold text-primary-900'>
								Quer começar pelas bases?
							</h3>
							<p className='text-secondary-700 text-sm'>
								Configure os clubes e quadras antes de habilitar reservas.
							</p>
						</div>
						<Button asChild variant='primary' size='md'>
							<Link to='/clubs'>Ir para Clubes</Link>
						</Button>
					</div>
				</Container>
			</div>
		</Layout>
	);
}
