'use client';

import LoginForm from "@/app/components/LoginForm";
import LoginController from "@/app/controllers/LoginController";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter(); 
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-[#3f3f3f]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-center text-2xl font-bold mb-6">WatchList</h2>
        <LoginForm onSubmit={handleSubmitForm} hasError={hasError} />
      </div>
    </div>
  );
}