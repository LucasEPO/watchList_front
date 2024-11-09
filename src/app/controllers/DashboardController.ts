import { useState, useEffect } from 'react';
import dashboardService from "../services/dashboardService";
import { Relatorio } from '../models/relatorio.interface';
import { Funcionario } from '../models/funcionario.interface';
import useTranslation from 'next-translate/useTranslation';
import { useAlert } from '../contexts/AlertContext';

const DashboardController = () => {
    const { t } = useTranslation('commom');
    const { showAlert } = useAlert();

    const tableReportsHeaders = [
        t('pages.dashboard.report-table.columns.title'),
        t('pages.dashboard.report-table.columns.creator'),
        t('pages.dashboard.report-table.columns.date'),
        t('pages.dashboard.report-table.columns.finished'),
        t('pages.dashboard.report-table.columns.actions'),
    ];
    const reportsColumnWidths = ["30%", "30%", "15%", "10%", "15%"];
    const tableEmployeesHeaders = [
        t('pages.dashboard.employee-table.columns.name'),
        t('pages.dashboard.employee-table.columns.email'),
        t('pages.dashboard.employee-table.columns.actions'),
    ];
    const employeesColumnWidths = ["42.5%", "42.5%", "15%"];
    const [relatorioModalOpen, setRelatorioModalOpen] = useState(false);
    const [funcionarioModalOpen, setFuncionarioOpen] = useState(false);
    const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
    const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
    const [activeTable, setActiveTable] = useState('reportes');

    const getReportsTableData = async () => {
        try {
            const data = await dashboardService.getReportData();
    
            const formattedData = data.map((report: Relatorio ) => {
              return {
                id: report.id,
                title: report.title,
                is_finished: report.is_finished ? true : false,
                is_priority: report.is_priority ? true : false,
                create_date: report.create_date,
                funcionario: report.funcionario ? { name: report.funcionario.name } : null,
              };
            });
        
            return formattedData;
        } catch (error: any) {
            let errorMessage = '';

            switch (error.code) {
                case 'ERROR_UNAUTHORIZED':
                    errorMessage = t('pages.dashboard.service-alerts.no-auth');
                    break;
                case 'ERROR_DATA_SEARCH':
                default:
                    errorMessage = t('pages.dashboard.service-alerts.reports.find');
                    break;
            }
            
            showAlert("error", errorMessage);
        }
    };

    const getEmployeesTableData = async () => {
        try {
            const data = await dashboardService.getAllEmployees();
    
            const formattedData = data.map((employee: Funcionario  ) => {
                return {
                    id: employee.id,
                    name: employee.name,
                    email: employee.email,
                };
            });
        
            return formattedData;
        } catch (error: any) {
            let errorMessage = '';

            switch (error.code) {
                case 'ERROR_UNAUTHORIZED':
                    errorMessage = t('pages.dashboard.service-alerts.no-auth');
                    break;
                case 'ERROR_DATA_SEARCH':
                default:
                    errorMessage = t('pages.dashboard.service-alerts.employees.find');
                    break;
            }
            
            showAlert("error", errorMessage);
        }
    }

    const useTableData = (activeTable: string) => {
        const [tableData, setTableData] = useState<any[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
        const [dataLength, setDataLength] = useState<number>(0);
      
        useEffect(() => {
            const loadReportsData = async () => {
                try {
                const formattedData = await getReportsTableData(); 
                    setTableData(formattedData);
                    setDataLength(formattedData.length);
                } catch (error) {
                    setError(t('pages.dashboard.alerts.error-loading'));
                } finally {
                    setLoading(false);
                }
            };
            const loadEmployeesData = async () => {
                try {
                    const formattedData = await getEmployeesTableData(); 

                    setTableData(formattedData);
                    setDataLength(formattedData.length);
                } catch (error) {
                    setError(t('pages.dashboard.alerts.error-loading'));
                } finally {
                    setLoading(false);
                }
            };
      
            if(activeTable === 'reportes')
                loadReportsData(); 
            else
                loadEmployeesData();
        }, [activeTable]);
      
        return { tableData, dataLength, loading, error, setTableData, setLoading, setError, setDataLength };
    };

    const refreshTableData = async (
        setTableData: React.Dispatch<React.SetStateAction<any[]>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string | null>>,
        setDataLength: React.Dispatch<React.SetStateAction<number>>,
        activeTable: string,
    ) => {
        setTableData([]);
        setLoading(true);
        try {
            let formattedData;
            if(activeTable === 'reportes'){
                formattedData = await getReportsTableData();
            } else {
                formattedData = await getEmployeesTableData();
            }
            setTimeout(() => {
                setTableData(formattedData);
                setDataLength(formattedData ? formattedData.length : 0);
            }, 1000);
        } catch (error) {
            setError(t('pages.dashboard.alerts.error-refresh'));
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const updateCheckboxRelatorio = async (id: number, field: string, value: boolean) => {
        const update = {[field]: value};
        const response = await dashboardService.updateRelatorio(id, update);
        return response;
    };

    const deleteRow = async (id: number, activeTable: string) => {
        let response;

        if(activeTable === 'reportes')
            response = await dashboardService.deleteRelatorio(id);
        else
            response = await dashboardService.deleteEmployee(id);
        return response;
        
    };
    
    const toggleRelatorioModal = (relatorio?: Relatorio) => {
        if(relatorio)
            setRelatorio(relatorio);
        
        setRelatorioModalOpen(!relatorioModalOpen);
    };

    const toggleFuncionarioModal = (funcionario?: Funcionario) => {
        if(funcionario)
            setFuncionario(funcionario);
        
        setFuncionarioOpen(!funcionarioModalOpen);
    };

    const updateRow = async (id:number, updates: object, activeTable: string) => {
        let response;
        if(activeTable === 'reportes')
            response = await dashboardService.updateRelatorio(id, updates);
        else
            response = await dashboardService.updateEmployee(id, updates);
        
        return response;
        
    }

    return {
        relatorioModalOpen,
        funcionarioModalOpen,
        setFuncionarioOpen,
        setRelatorioModalOpen,
        activeTable,
        setActiveTable,
        relatorio,
        funcionario,
        tableReportsHeaders,
        reportsColumnWidths,
        tableEmployeesHeaders,
        employeesColumnWidths,
        useTableData,
        refreshTableData,
        updateCheckboxRelatorio,
        deleteRow,
        toggleRelatorioModal,
        toggleFuncionarioModal,
        updateRow,
    };
}

export default DashboardController;