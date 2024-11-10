'use client';

import LoginForm from "@/app/components/LoginForm";
import RegistrationForm from "@/app/components/RegistrationForm";
import LoginController from "@/app/controllers/LoginController";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useTranslation from 'next-translate/useTranslation';
import { useAlert } from "@/app/contexts/AlertContext";
import dynamic from 'next/dynamic';

const LanguageSelector = dynamic(() => import("@/app/components/languageSelector"), {
	ssr: false
});

export default function LoginPage() {
	const router = useRouter(); 
	const { t } = useTranslation("common");
	const { showAlert } = useAlert();

	const [showRegistration, setShowRegistration] = useState(false);
	const [showRegistrationForm, setShowRegistrationForm] = useState(false);
	const [hasError, setHasError] = useState(false);

	const handleSubmitForm = async ({login, password }: { login: string; password: string }) => {
		try {
			const token = await LoginController.login(login, password);
			setHasError(false);
			router.push('/pages/dashboard');
		} catch (error: any) {
			setHasError(true);
			let errorMessage = '';

			switch (error.code) {
				case 'ERROR_INCORRECT_LOGIN':
					errorMessage = t('pages.login.alert.error-incorrect');
					break;
				case 'ERROR_NO_TOKEN':
					errorMessage = t('pages.login.alert.error-token');
					break;
				case 'ERROR_LOGIN_FAILED':
				default:
					errorMessage = `${t('pages.login.alert.error', {status: error.status})}`;
					break;
			}

			showAlert("error", errorMessage);
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
			<div className="absolute self-start mt-6">
				<LanguageSelector />
			</div>
			<div className={`bg-gray-800 p-8 rounded-lg shadow-lg w-full transition-all duration-450 ease-in-out ${showRegistration ? 'max-w-lg max-h-[600px]' : 'max-w-sm max-h-[400px]'}`}>
				<h2 className={`text-center text-2xl font-bold ${showRegistration ? '' : 'mb-6'}`}>{t('app.watchlist')}</h2>
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
								<h3 className="text-center font-bold mb-6">{t('pages.login.title-form')}</h3>
								<RegistrationForm onBackToLogin={() => setShowRegistration(false)} />
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
