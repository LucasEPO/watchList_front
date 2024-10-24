'use client';

import React, { useState } from 'react';
import RegistrationFormController from '../controllers/RegistrationFormController';

interface RegistrationFormProps {
  onBackToLogin: () => void;
}

const RegistrationForm = ({ onBackToLogin }: RegistrationFormProps) => {
  const {
    formData,
    setFormData,
    passError,
    loginError,
    handleSubmit,
  } = RegistrationFormController();
  
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="companyName">
          Nome da Empresa
        </label>
        <input
          id="companyName"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome da Empresa"
          className={`w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="login">
          Login
        </label>
        <input
          id="login"
          type="text"
          value={formData.login}
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
          placeholder="Login"
          className={`w-full text-black px-3 py-2 border ${loginError? 'border-red-600' : 'border-gray-300' } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Digite senha"
          className={`w-full text-black px-3 py-2 border ${passError? 'border-red-600' : 'border-gray-300' } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
          Repetir Senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="Repita a senha"
          className={`w-full text-black px-3 py-2 border ${passError? 'border-red-600' : 'border-gray-300' } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
          required
        />
      </div>
      <div className="flex flex-col items-center mb-4 md:col-span-2">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
        >
          Cadastrar
        </button>
      </div>
      <div className="flex justify-center md:col-span-2">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-orange-500 hover:underline"
        >
          Voltar ao Login
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;