'use client';

import { CircularProgress } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import React, { FormEvent, useState } from 'react';

interface LoginFormProps {
	onSubmit: (data: { login: string; password: string }) => void;
	onShowRegistration: () => void;
	hasError: boolean;
	setLoading: (loading: boolean) => void;
	loading: boolean;
}

const LoginForm = ({ onSubmit, onShowRegistration, hasError, setLoading, loading }: LoginFormProps) => {
	const { t } = useTranslation("common");
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		setLoading(true);
		onSubmit({ login, password });
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-4">
				<label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="login">
					{t('pages.login.login-form.login')}
				</label>
				<input
					id="login"
					type="text"
					value={login}
					onChange={(event) => setLogin(event.target.value)}
					placeholder={t('pages.login.login-form.login-placeholder')}
					className={`w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${hasError? 'outline outline-red-600' : ''}`}
					required
				/>
			</div>
			<div className="mb-6">
				<label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
					{t('pages.login.login-form.password')}
				</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					placeholder={t('pages.login.login-form.password-placeholder')}
					className={`w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${hasError? 'outline outline-red-600' : ''}`}
					required
				/>
			</div>
			<div className="flex flex-col items-center">
				<button
					type="submit"
					className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
				>
					{loading ? <CircularProgress color="inherit" size={20} /> : t('pages.login.login-form.login')}
				</button>
				<button
					type="button"
					className="mt-4 text-orange-500 hover:underline"
					onClick={onShowRegistration}
				>
					{t('pages.login.login-form.create-account')}
				</button>
			</div>
		</form>
	);
};

export default LoginForm;