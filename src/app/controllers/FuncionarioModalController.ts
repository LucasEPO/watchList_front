import React, { useEffect } from "react";
import { Funcionario } from "../models/funcionario.interface";
import dashboardService from "../services/dashboardService";
import { CreateFuncionario } from "../models/create-funcionario.interface";
import useTranslation from "next-translate/useTranslation";

const FuncionarioModalController = (onClose: () => void, handleRefresh: () => void, funcionario: Funcionario | null) => {   
    const { t } = useTranslation("commom");

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

    const handleSubmit = async (event: React.FormEvent, showAlert: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void) => {
        event.preventDefault();

        let response;
        try {
            if (funcionario && funcionario.id) {
                response = await dashboardService.updateEmployee(funcionario.id, formData);
                showAlert("success", t('pages.dashboard.employee-modal.alerts.update-success'));

            } else {

                if(!enterpriseId)
                    throw {code: 'ERROR_COMPANY_NOT_FOUND', status: 404};

                const funcionario: CreateFuncionario = {
                    ...formData,
                    empresa: enterpriseId,
                };
                response = await dashboardService.createEmployee(funcionario);
                showAlert("success", t('pages.dashboard.employee-modal.alerts.create-success'));
            }
            handleRefresh();
            handleCloseModal();
            return response;
        } catch (error: any) {
            let errorMessage = '';

            switch (error.code) {
                case 'ERROR_COMPANY_NOT_FOUND':
                    errorMessage = t('pages.dashboard.employee-modal.alerts.error-company');
                    break;
                case 'ERROR_NOT_FOUND':
                    errorMessage = t('pages.dashboard.service-alerts.employees.find-one');
                case 'ERROR_UPDATE':
                    errorMessage = t('pages.dashboard.service-alerts.employee.update');
                case 'ERROR_CREATE':
                default:
                    errorMessage = t('pages.dashboard.service-alerts.employee.create');
                    break;
            }

            showAlert("error", errorMessage);
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