import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import dashboardService from "../services/dashboardService";
import { Employee } from "../models/employee.interface";
import { SelectChangeEvent } from "@mui/material";

interface AutocompleteEmployeeOption {
    id: number;
    name: string;
};

interface StatusOptions {
    label: string;
    value: boolean | null;
    field: string
};

const FiltersController = () => {
    const { t } = useTranslation('common');

    const [textFilter, setTextFilter] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<AutocompleteEmployeeOption | null>(null);
    const [autocompleteEmployeeOpen, setAutocompleteEmployeeOpen] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState<AutocompleteEmployeeOption[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedStatusOptions, setSelectedStatusOptions] = useState<{ finished: boolean | null, priority: boolean | null }>({
        finished: null,
        priority: null,
    });

    const statusOptions: StatusOptions[] = [
        { label: t ('pages.dashboard.tables.filters.status.finished'), value: true, field: 'is_finished' },
        { label: t ('pages.dashboard.tables.filters.status.not-finished'), value: false, field: 'is_finished' },
        { label: t ('pages.dashboard.tables.filters.status.priority'), value: true, field: 'is_priority' },
        { label: t ('pages.dashboard.tables.filters.status.not-priority'), value: false, field: 'is_priority' }
    ];

    const selectedStatusLabels = statusOptions
        .filter((option) => {
            if (option.field === 'is_finished' && option.value === selectedStatusOptions.finished) return true;
            if (option.field === 'is_priority' && option.value === selectedStatusOptions.priority) return true;
            return false;
        })
        .map((option) => option.label);

    const handleAutocompleteClose = () => {
        setAutocompleteEmployeeOpen(false);
    };

    const handleAutocompleteOpen = (showAlert: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void) => {
        setAutocompleteEmployeeOpen(true);
        fetchOptions(showAlert);
    }; 

    const fetchOptions = async (showAlert?: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void) => {
        setLoading(true);
        try {
            const empresaId = sessionStorage.getItem("empresa_id");
            if (!empresaId) throw {code: 'ERROR_COMPANY_NOT_FOUND'};
        
            const response = await dashboardService.getAllEmployees(); 

            setEmployeeOptions(response.map((employee: Employee) => ({
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

    const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
        const {
          target: { value },
        } = event;
    
        const selectedLabels = typeof value === 'string' ? value.split(',') : value;
    
        const newSelectedOptions: { finished: boolean | null; priority: boolean | null } = {
            finished: null,
            priority: null,
        };
        selectedLabels.forEach((label) => {
            const option = statusOptions.find((opt) => opt.label === label);
            if (option) {
                if (option.field === 'is_finished') {
                    newSelectedOptions.finished = option.value;
                } else if (option.field === 'is_priority') {
                    newSelectedOptions.priority = option.value;
                }
            }
        });

        setSelectedStatusOptions(newSelectedOptions);
    };

    return {
        textFilter,
        setTextFilter,
        selectedEmployee,
        setSelectedEmployee,
        autocompleteEmployeeOpen,
        employeeOptions,
        loading,
        handleAutocompleteClose,
        handleAutocompleteOpen,
        statusOptions,
        selectedStatusOptions,
        handleStatusChange,
        selectedStatusLabels,
    };

};

export default FiltersController;