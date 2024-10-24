import React, { FormEvent } from "react";
import authService from "../services/authService";
import { CreateEmpresa } from "../models/create-empresa.interface";
import { useRouter } from "next/navigation";

const RegistrationFormController = () => {
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

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!formData.name || !formData.login || !formData.password || !formData.confirmPassword) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        if(formData.password !== formData.confirmPassword){
            setPassError(true);
            window.alert('As senhas devem ser iguais!');
            return;
        }
        setPassError(false);
        const newCompany: CreateEmpresa = {
            name: formData.name,
            login: formData.login,
            pass_hash: formData.password,
        };

        try{
            const token = await authService.registration(newCompany);
            setLoginError(false);
            router.push('/dashboard');
        } catch (error) {
            setLoginError(true);
            window.alert(error);
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