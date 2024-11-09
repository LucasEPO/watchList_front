import React, { useEffect } from 'react';
import axios from 'axios';
import { Funcionario } from '../models/funcionario.interface.js';
import moment from 'moment';
import { Relatorio } from '../models/relatorio.interface.js';
import dashboardService from '../services/dashboardService';
import useTranslation from 'next-translate/useTranslation';

interface AutocompleteOption {
    id: number;
    name: string;
}

const API_URL = "http://localhost:3001"; 
    
const RelatorioModalController = (onClose: () => void, handleRefresh: () => void, relatorio: Relatorio | null) => {   
    const { t } = useTranslation('commom');

    const [enterpriseId, setEnterpriseId] = React.useState<number | null>(null);

    const initialFormData = {
        title: '',
        department: '',
        equipment: '',
        description: '',
        preventionAction: '',
        riskAction: '',
        enterpriseId: enterpriseId,
        employeeId: null as number | null,
        date: moment(),
        finishDate: moment() as moment.Moment | null,
    };

    const [autocompleteOpen, setAutocompleteOpen] = React.useState(false);
    const [options, setOptions] = React.useState<AutocompleteOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [isPriority, setIsPriority] = React.useState(false);
    const [isFinished, setIsFinished] = React.useState<boolean>(false);
    const [workshift, setWorkshift] = React.useState('1');
    const [formData, setFormData] = React.useState(initialFormData);

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        if (relatorio && relatorio.id) {
            setFormData({
                title: relatorio.title || '',
                department: relatorio.department || '',
                equipment: relatorio.equipament || '',
                description: (relatorio.description).toString() || '',
                preventionAction: relatorio.prevention_action? (relatorio.prevention_action).toString() || '' : '',
                riskAction: relatorio.risk_action? (relatorio.risk_action).toString() || '' : '',
                enterpriseId: enterpriseId,
                employeeId: relatorio.funcionario?.id || null,
                date: relatorio.date ? moment(relatorio.date) : moment(),
                finishDate: relatorio.finished_date ? moment(relatorio.finished_date) : null,
            });
            setIsFinished(relatorio.is_finished || false);
            setIsPriority(relatorio.is_priority || false);
            setWorkshift(relatorio.workshift || '1');
        } else {
            setFormData(initialFormData);
        }

    }, [relatorio, options]);

    const fetchEnterpriseId = () => {
        if (typeof window !== 'undefined') {
            const id = sessionStorage.getItem("empresa_id");
            setEnterpriseId(id ? +id : null);
        }
    };

    const handleAutocompleteClose = () => {
        setAutocompleteOpen(false);
    };

    const resetFormData = () => {
        setFormData(initialFormData);
        setIsFinished(false);
        setIsPriority(false);
        setWorkshift('1');
    };

    const handleSubmit = async (event: React.FormEvent, showAlert: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void) => {
        event.preventDefault();
        let response;
        try {

            if (relatorio && relatorio.id) {
                response = await dashboardService.updateRelatorio(relatorio.id, {
                    ...formData,
                    is_priority: isPriority,
                    is_finished: isFinished,
                    equipament: formData.equipment,
                    prevention_action: formData.preventionAction,
                    risk_action: formData.riskAction,
                });
                showAlert("success", t('pages.dashboard.report-modal.alerts.update-success'));

            } else {

                if(!enterpriseId)
                    throw {code: 'ERROR_COMPANY_NOT_FOUND', status: 404};
                

                response = await axios.post(`${API_URL}/relatorios`, {
                    ...formData,
                    isPriority,
                    isFinished,
                    workshift,
                });

                showAlert("success", t('pages.dashboard.report-modal.alerts.create-success'));
            }

            handleRefresh();
            handleCloseModal();

            return response;
        } catch (error: any) {
            let errorMessage = '';

            switch (error.code) {
                case 'ERROR_COMPANY_NOT_FOUND':
                    errorMessage = t('pages.dashboard.report-modal.alerts.error-company');
                    break;
                case 'ERROR_NOT_FOUND':
                    errorMessage = t('pages.dashboard.service-alerts.reports.find-one');
                case 'ERROR_UPDATE':
                    errorMessage = t('pages.dashboard.service-alerts.reports.update');
                case 'ERROR_CREATE':
                default:
                    errorMessage = t('pages.dashboard.service-alerts.reports.create');
                    break;
            }

            showAlert("error", errorMessage);
        }
    };

    const handleCloseModal = async () => {
        resetFormData();
        onClose();
    };
    
    const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPriority(event.target.checked);
    };
    
    const handleFinishedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsFinished(event.target.checked);
    };
  
    const handleAutocompleteOpen = (showAlert: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void) => {
        setAutocompleteOpen(true);
        fetchOptions(showAlert);
    }; 

    const fetchOptions = async (showAlert?: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void) => {
        setLoading(true);
        try {
            const empresaId = sessionStorage.getItem("empresa_id");
            if (!empresaId) throw {code: 'ERROR_COMPANY_NOT_FOUND'};

            const response = await axios.get(`${API_URL}/funcionarios/empresa/${empresaId}`);
            setOptions(response.data.map((funcionario: Funcionario) => ({
                id: funcionario.id,
                name: funcionario.name,
            })));
        } catch (error:any) {
            let errorMessage = '';

            switch (error.code) {
                case 'ERROR_COMPANY_NOT_FOUND':
                    errorMessage = t('pages.dashboard.report-modal.alerts.error-company');
                    break;
                case 'ERROR_FETCHING':
                    errorMessage = t('pages.dashboard.report-modal.alerts.error-find');
                default:
                    break;
            }

            showAlert ? showAlert("error", errorMessage) : console.log(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWorkshift((event.target as HTMLInputElement).value);
    };


    return {
        autocompleteOpen,
        formData,
        setFormData,
        options,
        loading,
        isPriority,
        isFinished,
        workshift,
        handleChange,
        handleSubmit,
        handleCloseModal,
        handleAutocompleteClose,
        handlePriorityChange,
        handleFinishedChange,
        handleAutocompleteOpen,
        fetchEnterpriseId,
    };
};

export default RelatorioModalController;
