import React, { FormEvent } from "react";
import authService from "../services/authService";
import { CreateCompany } from "../models/create-company.interface";
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";

const RegistrationFormController = () => {
    const { t } = useTranslation("common");
    const router = useRouter(); 
    const initialRegistrationFormData = {
        name: '',
        login: '',
        password: '',
        confirmPassword: '',
    };

    const [formData, setFormData] = React.useState(initialRegistrationFormData);
    const [passError, setPassError] = React.useState<boolean>(false);
    const [loginError, setLoginError] = React.useState<boolean>(false);

    const handleSubmit = async (event: FormEvent, showAlert: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void) => {
        event.preventDefault();

        if (!formData.name || !formData.login || !formData.password || !formData.confirmPassword) {
            showAlert("warning", t('pages.login.registration-form.alerts.required-fields') );
            return;
        }

        if(formData.password !== formData.confirmPassword){
            setPassError(true);
            showAlert("warning", t('pages.login.registration-form.alerts.match-passwords') );
            return;
        }
        setPassError(false);
        const newCompany: CreateCompany = {
            name: formData.name,
            login: formData.login,
            pass_hash: formData.password,
        };

        try{
            const token = await authService.registration(newCompany);
            setLoginError(false);
            showAlert("success", t('pages.login.registration-form.alerts.success') );
            router.push('/pages/dashboard');
        } catch (error: any) {
            setLoginError(true);
            let errorMessage = '';
            
            switch (error.code) {
                case 'ERROR_REPEATED_LOGIN':
                    console.log('a');
                    errorMessage = t('pages.login.registration-form.alerts.duplicated-login');
                    break;
                case 'ERROR_REGISTRATION_FAILED':
                default:
                    errorMessage = `${t('pages.login.registration-form.alerts.error')} (Status: ${error.status})`;
                    break;
            }

            showAlert("error", errorMessage);
        }
    };

    return{
        formData,
        setFormData,
        passError,
        loginError,
        handleSubmit,
    };
};

export default RegistrationFormController;