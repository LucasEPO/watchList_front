import React, { useEffect } from 'react';
import axios from 'axios';
import { Employee } from '../models/employee.interface.js';
import moment from 'moment';
import { Report } from '../models/report.interface.js';
import dashboardService from '../services/dashboardService';
import useTranslation from 'next-translate/useTranslation';

interface AutocompleteOption {
    id: number;
    name: string;
}
    
const ReportModalController = (onClose: () => void, handleRefresh: () => void, report: Report | null) => {   
    const { t } = useTranslation('common');

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
        if (report && report.id) {
            setFormData({
                title: report.title || '',
                department: report.department || '',
                equipment: report.equipament || '',
                description: (report.description).toString() || '',
                preventionAction: report.prevention_action? (report.prevention_action).toString() || '' : '',
                riskAction: report.risk_action? (report.risk_action).toString() || '' : '',
                enterpriseId: enterpriseId,
                employeeId: report.funcionario?.id || null,
                date: report.date ? moment(report.date) : moment(),
                finishDate: report.finished_date ? moment(report.finished_date) : null,
            });
            setIsFinished(report.is_finished || false);
            setIsPriority(report.is_priority || false);
            setWorkshift(report.workshift || '1');
        } else {
            setFormData(initialFormData);
        }

    }, [report]);

    const fetchCompanyId = () => {
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

            if (report && report.id) {
                response = await dashboardService.updateReport(report.id, {
                    ...formData,
                    is_priority: isPriority,
                    is_finished: isFinished,
                    workshift: workshift,
                    equipament: formData.equipment,
                    prevention_action: formData.preventionAction,
                    risk_action: formData.riskAction,
                });
                showAlert("success", t('pages.dashboard.report-modal.alerts.update-success'));

            } else {

                if(!enterpriseId)
                    throw {code: 'ERROR_COMPANY_NOT_FOUND', status: 404};
                
                response = await dashboardService.createReport({...formData, isPriority, isFinished, workshift})

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
        
            const response = await dashboardService.getAllEmployees(); 

            setOptions(response.map((employee: Employee) => ({
                id: employee.id,
                name: employee.name,
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
        fetchCompanyId,
    };
};

export default ReportModalController;
