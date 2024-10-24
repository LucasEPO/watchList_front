'use client';

import LoginForm from "@/app/components/LoginForm";
import RegistrationForm from "@/app/components/RegistrationForm";
import LoginController from "@/app/controllers/LoginController";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter(); 
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmitForm = async ({login, password }: { login: string; password: string }) => {
    try {
      const token = await LoginController.login(login, password);
      setHasError(false);
      router.push('/dashboard');
    } catch (error) {
      setHasError(true);
      window.alert('Usuário ou senha inválidos');
    }
    
  };

  useEffect(() => {
    if (showRegistration) {
      const timeoutId = setTimeout(() => setShowRegistrationForm(true), 450);
      return () => clearTimeout(timeoutId);
    } else {
      setShowRegistrationForm(false);
    }
  }, [showRegistration]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-[#3f3f3f]">
      <div className={`bg-gray-800 p-8 rounded-lg shadow-lg w-full transition-all duration-450 ease-in-out ${showRegistration ? 'max-w-lg max-h-[600px]' : 'max-w-sm max-h-[400px]'}`}>
        <h2 className={`text-center text-2xl font-bold ${showRegistration ? '' : 'mb-6'}`}>WatchList</h2>
        {!showRegistration ? (
          <LoginForm 
            onSubmit={handleSubmitForm} 
            hasError={hasError} 
            onShowRegistration={() => setShowRegistration(true)}
          />
        ) : (
          <div className="">
            {showRegistrationForm && (
              <div className={`transition-all duration-500 overflow-hidden`} style={{ height: showRegistrationForm ? 'auto' : '0' }}>
                <h3 className="text-center font-bold mb-6">Cadastrar Empresa</h3>
                <RegistrationForm onBackToLogin={() => setShowRegistration(false)} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}