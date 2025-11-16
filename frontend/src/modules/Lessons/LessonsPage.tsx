import { useMemo, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { TeacherSchedulePage } from './TeacherSchedulePage';
import { StudentLessonsPage } from './StudentLessonsPage';
import { Loading } from '@packages/components';

/**
 * Página principal de Aulas que detecta o tipo de usuário
 * e renderiza a interface apropriada (Professor ou Aluno)
 */
export function LessonsPage() {
	const { user } = useAuth();
	const [userRoles, setUserRoles] = useState<Array<{ id: number; name: string }>>([]);
	const [isLoadingRoles, setIsLoadingRoles] = useState(true);

	useEffect(() => {
		const fetchUserRoles = async () => {
			if (!user?.id) {
				setIsLoadingRoles(false);
				return;
			}

			try {
				// Primeiro tenta usar os roles que já vêm do user (se disponíveis)
				if (user.roles && user.roles.length > 0) {
					setUserRoles(user.roles);
					setIsLoadingRoles(false);
					return;
				}

				// Se não tiver roles no user, busca da API
				const response = await api.get(`/users/${user.id}`, {
					params: {
						include: JSON.stringify({
							userHasRoles: {
								include: {
									role: true,
								},
							},
						}),
					},
				});

				// Extrair roles do response
				const roles = response.data?.userHasRoles?.map((uhr: any) => uhr.role) || 
				              response.data?.roles || [];
				setUserRoles(roles);
			} catch (error) {
				console.error('Erro ao buscar roles do usuário:', error);
				setUserRoles([]);
			} finally {
				setIsLoadingRoles(false);
			}
		};

		void fetchUserRoles();
	}, [user?.id, user?.roles]);

	const isTeacher = useMemo(() => {
		return userRoles.some(role => role.name === 'Teacher');
	}, [userRoles]);

	if (isLoadingRoles) {
		return (
			<div className='flex h-64 items-center justify-center rounded-xl border border-orange-300 bg-white'>
				<Loading />
			</div>
		);
	}

	if (isTeacher) {
		return <TeacherSchedulePage />;
	}

	return <StudentLessonsPage />;
}

