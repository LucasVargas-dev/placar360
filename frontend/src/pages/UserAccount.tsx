import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Header } from '../navigation/Header';
import { User, Mail, Phone, Calendar, Save, Edit2 } from 'lucide-react';
import { Button, Input, Toast } from '@packages/components';
import { z } from 'zod';
import { useZodForm } from '@/hooks/useZodForm';
import { FormLayout } from '@pages/_shared/FormLayout';
import { showApiErrorToast } from '@utils/errorHandling';

const userUpdateSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido'),
});

type UserUpdateData = z.infer<typeof userUpdateSchema>;

interface UserData {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt?: string;
  person?: {
    id: string;
    name: string;
  };
}

export default function UserAccount() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useZodForm({
    schema: userUpdateSchema,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    },
  });

  const {
    register,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    fetchUserData();
  }, [authUser]);

  const fetchUserData = async () => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/users/${authUser.id}`);
      setUserData(response.data);
      reset({
        name: response.data.person?.name || response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
      });
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      showApiErrorToast({
        error: err,
        title: 'Erro ao carregar dados',
        defaultMessage: 'Não foi possível carregar suas informações.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserUpdateData) => {
    if (!userData) return;

    setIsSaving(true);
    try {
      const response = await api.patch(`/users/${userData.id}`, data);
      setUserData(response.data);
      setIsEditing(false);
      
      Toast.show({
        title: 'Dados atualizados!',
        description: 'Suas informações foram atualizadas com sucesso',
        status: 'success',
      });
    } catch (err: unknown) {
      console.error('Error updating user:', err);
      showApiErrorToast({
        error: err,
        title: 'Erro ao atualizar',
        defaultMessage: 'Não foi possível atualizar seus dados.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!authUser || !userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado para acessar esta página
            </p>
            <Button
              as="a"
              href="/login"
              variant="primary"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = userData.person?.name || userData.name || 'Usuário';
  const displayEmail = userData.email || authUser.email;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Minha Conta
              </h1>
              {!isEditing && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Edit2 size={18} />}
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              )}
            </div>
            <p className="text-gray-600">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FormLayout
              form={form}
              onSubmit={onSubmit}
              showDefaultActions={false}
              variant="plain"
              className="p-0"
              formClassName="space-y-6"
              footerSlot={
                isEditing ? (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      isDisabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSaving}
                      leftIcon={<Save size={18} />}
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                ) : undefined
              }
            >
              {/* Avatar Section */}
              <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                <div className="h-24 w-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {displayName}
                  </h2>
                  <p className="text-gray-600">{displayEmail}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="name"
                      register={register}
                      placeholder="Digite seu nome completo"
                      isFullWidth
                      errorInfo={errors.name?.message}
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-md text-gray-900">
                      {displayName}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    E-mail
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="email"
                      register={register}
                      placeholder="Digite seu e-mail"
                      isFullWidth
                      errorInfo={errors.email?.message}
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-md text-gray-900">
                      {displayEmail}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Telefone
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="phone"
                      register={register}
                      placeholder="(00) 00000-0000"
                      isFullWidth
                      errorInfo={errors.phone?.message}
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-md text-gray-900">
                      {userData.phone || 'Não informado'}
                    </div>
                  )}
                </div>

                {userData.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Membro desde
                    </label>
                    <div className="px-4 py-2 bg-gray-50 rounded-md text-gray-900">
                      {new Date(userData.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
            </FormLayout>
          </div>
        </div>
      </main>
    </div>
  );
}
