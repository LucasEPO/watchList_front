import React, { useEffect } from 'react';
import axios from 'axios';
import { Funcionario } from '../models/funcionario.interface.js';
import moment from 'moment';
import { Relatorio } from '../models/relatorio.interface.js';
import dashboardService from '../services/dashboardService';

interface AutocompleteOption {
    id: number;
    name: string;
}

const API_URL = "http://localhost:3001"; 
    
const RelatorioModalController = (onClose: () => void, handleRefresh: () => void, relatorio: Relatorio | null) => {   
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

    const handleSubmit = async (event: React.FormEvent) => {
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

            } else {
                response = await axios.post(`${API_URL}/relatorios`, {
                    ...formData,
                    isPriority,
                    isFinished,
                    workshift,
                });
            }
            handleRefresh();
            handleCloseModal();
            return response;
        } catch (error) {
            console.log(error);
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
  
    const handleAutocompleteOpen = () => {
        setAutocompleteOpen(true);
        fetchOptions();
    }; 

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const empresaId = sessionStorage.getItem("empresa_id");
            if (!empresaId) throw new Error("Id da empresa não encontrado");

            const response = await axios.get(`${API_URL}/funcionarios/empresa/${empresaId}`);
            setOptions(response.data.map((funcionario: Funcionario) => ({
                id: funcionario.id,
                name: funcionario.name,
            })));
        } catch (error) {
            console.error(error);
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
