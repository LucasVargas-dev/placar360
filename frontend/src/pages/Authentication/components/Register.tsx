import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Button, Input, Toast } from '@packages/components';
import { authRegister } from '../auth.service';
import { RegisterData, registerSchema } from '../authSchema';
import { useZodForm } from '@/hooks/useZodForm';
import { FormLayout } from '@pages/_shared/FormLayout';
import { showApiErrorToast } from '@utils/errorHandling';

interface RegisterProps {
  onToggleMode: () => void;
}

export function Register({ onToggleMode }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useZodForm({
    schema: registerSchema,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    register,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: RegisterData): Promise<void> => {
    setIsSubmitting(true);
    try {
      await authRegister({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      Toast.show({
        title: 'Conta criada com sucesso!',
        description: 'Redirecionando para login...',
        status: 'success',
      });

      reset();
      
      // Switch to login after successful registration
      setTimeout(() => {
        onToggleMode();
        setIsSubmitting(false);
      }, 1500);
    } catch (error: unknown) {
      showApiErrorToast({
        error,
        title: 'Erro ao criar conta',
        defaultMessage: 'Não foi possível criar sua conta. Tente novamente.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <FormLayout
        form={form}
        onSubmit={onSubmit}
        title="Crie sua conta"
        description="Junte-se ao Placar360 e comece a organizar seus torneios"
        showDefaultActions={false}
        variant="plain"
        className="p-0"
        formClassName="gap-5"
      >
        <Input
          type="text"
          name="name"
          register={register}
          placeholder="Digite seu nome completo (opcional)"
          leftIcon={<User size={18} />}
          size="md"
          isFullWidth={true}
          errorInfo={errors.name?.message}
        />

        <Input
          type="text"
          name="email"
          register={register}
          placeholder="Digite seu e-mail"
          leftIcon={<Mail size={18} />}
          size="md"
          isFullWidth={true}
          errorInfo={errors.email?.message}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          register={register}
          placeholder="Digite sua senha"
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          size="md"
          isFullWidth={true}
          errorInfo={errors.password?.message}
        />

        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          register={register}
          placeholder="Confirme sua senha"
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          size="md"
          isFullWidth={true}
          errorInfo={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          variant="primary"
          size="md"
          isFullWidth
          className="mt-2 !bg-orange-500 !hover:bg-orange-600 !text-white !border-orange-500"
        >
          Criar Conta
        </Button>
      </FormLayout>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Já tem conta?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
}

