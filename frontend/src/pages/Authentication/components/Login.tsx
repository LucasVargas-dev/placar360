import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button, Input, Toast } from '@packages/components';
import { LoginData, loginSchema } from '../authSchema';
import { useAuth } from '../../../contexts/AuthContext';
import { useZodForm } from '@/hooks/useZodForm';
import { FormLayout } from '@pages/_shared/FormLayout';
import { showApiErrorToast } from '@utils/errorHandling';

interface LoginProps {
  onToggleMode: () => void;
}

export function Login({ onToggleMode }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useZodForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (data: LoginData): Promise<void> => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      
      Toast.show({
        title: 'Login realizado com sucesso!',
        status: 'success',
      });
      
      navigate('/dashboard');
    } catch (error: unknown) {
      showApiErrorToast({
        error,
        title: 'Erro ao fazer login',
        defaultMessage:
          'Não foi possível conectar. Verifique suas credenciais e tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <FormLayout
        form={form}
        onSubmit={onSubmit}
        title="Bem-vindo de volta"
        description="Entre na sua conta para continuar"
        showDefaultActions={false}
        variant="plain"
        className="p-0"
        formClassName="gap-5"
      >
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

        <div className="flex flex-col gap-1">
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

          <div className="flex w-full justify-end">
            <button
              type="button"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Esqueceu sua senha?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          variant="primary"
          size="md"
          isFullWidth
          className="mt-2 !bg-orange-500 !hover:bg-orange-600 !text-white !border-orange-500"
        >
          Entrar
        </Button>
      </FormLayout>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Não tem conta?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Registre-se
          </button>
        </p>
      </div>
    </div>
  );
}

