import { useState } from 'react';
import { Logo } from '@pages/_shared/Logo';
import { Login } from './Login';
import { Register } from './Register';

export function AuthenticatePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-emerald-800/50 to-emerald-700/50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      
      <div className="relative w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-700">
          <div className="flex min-h-[600px]">
            {/* Left Side - Form */}
            <div className={`flex-1 p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ${
              isLoading ? 'w-full' : 'w-full md:w-1/2'
            }`}>
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                  <Logo size="large" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Placar360
                </h1>
              </div>

              {isLogin ? (
                <div className="transition-all duration-500 opacity-100 translate-x-0">
                  <Login onToggleMode={toggleMode} />
                </div>
              ) : (
                <div className="transition-all duration-500 opacity-100 translate-x-0">
                  <Register onToggleMode={toggleMode} />
                </div>
              )}
            </div>

            {/* Right Side - Decorative */}
            {!isLoading && (
              <div className="hidden md:flex w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center p-8">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-bold mb-4">
                    Gerencie seus Torneios
                  </h2>
                  <p className="text-lg opacity-90">
                    Organize, participe e acompanhe seus torneios esportivos de forma simples e eficiente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white/80 text-sm">
          © 2025 Placar360. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}

