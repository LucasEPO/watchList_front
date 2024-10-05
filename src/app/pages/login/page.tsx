'use client';

import LoginForm from "@/app/components/LoginForm";
import LoginController from "@/app/controllers/LoginController";

export default function LoginPage() {

  const handleSubmitForm = async ({ login, password }: { login: string; password: string }) => {
    const token = await LoginController.login(login, password);
    localStorage.setItem('token', token);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-center text-2xl font-bold mb-6">WatchList</h2>
        <LoginForm onSubmit={handleSubmitForm} />
      </div>
    </div>
  );
}