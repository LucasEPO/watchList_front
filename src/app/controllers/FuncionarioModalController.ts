import React, { useEffect } from "react";
import { Funcionario } from "../models/funcionario.interface";
import dashboardService from "../services/dashboardService";
import { CreateFuncionario } from "../models/create-funcionario.interface";

const FuncionarioModalController = (onClose: () => void, handleRefresh: () => void, funcionario: Funcionario | null) => {   
    const [enterpriseId, setEnterpriseId] = React.useState<number | null>(null);
    const initialFormData = {
        name: '',
        email: '',
        enterpriseId: enterpriseId,
    };

    const [formData, setFormData] = React.useState(initialFormData);

    useEffect(() => {
        if (funcionario && funcionario.id) {
            setFormData({
                name: funcionario.name || '',
                email: funcionario.email || '',
                enterpriseId: enterpriseId,
            });
        } else {
            setFormData(initialFormData);
        }

    }, [funcionario]);

    const resetFormData = () => {
        setFormData(initialFormData);
    };

    const handleCloseModal = async () => {
        resetFormData();
        onClose();
    };

    const fetchEnterpriseId = () => {
        if (typeof window !== 'undefined') {
            const id = sessionStorage.getItem("empresa_id");
            setEnterpriseId(id ? +id : null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        let response;
        try {
            if (funcionario && funcionario.id) {
                response = await dashboardService.updateEmployee(funcionario.id, formData);

            } else {

                if(!enterpriseId)
                    throw new Error("Erro ao buscar por empresa!");

                const funcionario: CreateFuncionario = {
                    ...formData,
                    empresa: enterpriseId,
                };
                response = await dashboardService.createEmployee(funcionario);
            }
            handleRefresh();
            handleCloseModal();
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return{
        formData,
        setFormData,
        handleCloseModal,
        handleSubmit,
        fetchEnterpriseId,
    }
};

export default FuncionarioModalController;