import React, { useEffect } from "react";
import { Employee } from "../models/employee.interface";
import dashboardService from "../services/dashboardService";
import { CreateEmployee } from "../models/create-employee.interface";
import useTranslation from "next-translate/useTranslation";

const EmployeeModalController = (onClose: () => void, handleRefresh: () => void, employee: Employee | null) => {   
    const { t } = useTranslation("common");

    const [companyId, setCompanyId] = React.useState<number | null>(null);
    const initialFormData = {
        name: '',
        email: '',
        companyId: companyId,
    };

    const [formData, setFormData] = React.useState(initialFormData);

    useEffect(() => {
        if (employee && employee.id) {
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                companyId: companyId,
            });
        } else {
            setFormData(initialFormData);
        }

    }, [employee]);

    const resetFormData = () => {
        setFormData(initialFormData);
    };

    const handleCloseModal = async () => {
        resetFormData();
        onClose();
    };

    const fetchCompanyId = () => {
        if (typeof window !== 'undefined') {
            const id = sessionStorage.getItem("empresa_id");
            setCompanyId(id ? +id : null);
        }
    };

    const handleSubmit = async (event: React.FormEvent, showAlert: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void) => {
        event.preventDefault();

        let response;
        try {
            if (employee && employee.id) {
                response = await dashboardService.updateEmployee(employee.id, formData);
                showAlert("success", t('pages.dashboard.employee-modal.alerts.update-success'));

            } else {

                if(!companyId)
                    throw {code: 'ERROR_COMPANY_NOT_FOUND', status: 404};

                const employee: CreateEmployee = {
                    ...formData,
                    empresa: companyId,
                };
                response = await dashboardService.createEmployee(employee);
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
        fetchCompanyId,
    }
};

export default EmployeeModalController;