import { useState, useEffect } from 'react';
import dashboardService from "../services/dashboardService";
import { Report } from '../models/report.interface';
import { Employee } from '../models/employee.interface';
import useTranslation from 'next-translate/useTranslation';
import { useAlert } from '../contexts/AlertContext';

const DashboardController = () => {
    const { t } = useTranslation('common');
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
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [employeeModalOpen, setEmployeeOpen] = useState(false);
    const [report, setReport] = useState<Report | null>(null);
    const [employee, setFuncionario] = useState<Employee | null>(null);
    const [activeTable, setActiveTable] = useState<'reports' | 'employees'>('reports');

    const getReportsTableData = async () => {
        try {
            const data = await dashboardService.getReportData();
    
            const formattedData = data.map((report: Report ) => {
                return {
                    id: report.id,
                    title: report.title,
                    is_finished: report.is_finished ? true : false,
                    is_priority: report.is_priority ? true : false,
                    date: report.date,
                    funcionario: report.funcionario ? { name: report.funcionario.name } : null,
                };
            });

            const sortedData = formattedData.sort((a: Report, b: Report) => {
                return a.is_priority === b.is_priority ? 0 : a.is_priority ? -1 : 1;
            });
        
            return sortedData;
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
    
            const formattedData = data.map((employee: Employee  ) => {
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
        const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(null);
      
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
      
            if(activeTable === 'reports')
                loadReportsData(); 
            else
                loadEmployeesData();
        }, [activeTable]);

        const sortTableData = (keyIndex: number) => {
            let sortableColumns;
            if (activeTable === 'reports') {
                if(keyIndex > 3) return;
                sortableColumns = ['title', 'creator', 'date', 'is_finished'];
            } else {
                if(keyIndex > 1) return;
                sortableColumns = ['name', 'email'];
            }

            let column = sortableColumns[keyIndex];

            let direction: 'asc' | 'desc' | null = 'asc';
            if (sortConfig && sortConfig.column === column) {
                if (sortConfig.direction === 'asc') 
                    direction = 'desc';
                else if (sortConfig.direction === 'desc') 
                    direction = null;
                
            }
            
            let sortedData;

            if (direction) {            
                sortedData = [...tableData].sort((a, b) => {
            
                    if (column === 'date') {
                        return direction === 'asc' 
                            ? new Date(a[column]).getTime() - new Date(b[column]).getTime()
                            : new Date(b[column]).getTime() - new Date(a[column]).getTime();
                    }
            
                    if (column === 'creator') {
                        const nameA = a.funcionario ? a.funcionario.name : '';
                        const nameB = b.funcionario ? b.funcionario.name : '';
            
                        if (nameA < nameB) {
                            return direction === 'asc' ? -1 : 1;
                        }
                        if (nameA > nameB) {
                            return direction === 'asc' ? 1 : -1;
                        }
                        return 0;
                    }
            
                    if (a[column] < b[column]) {
                        return direction === 'asc' ? -1 : 1;
                    }
            
                    if (a[column] > b[column]) {
                        return direction === 'asc' ? 1 : -1;
                    }
            
                    return 0;
                });
            } else {
                sortedData = [...tableData].sort((a: Report, b: Report) => {
                    return a.is_priority === b.is_priority ? 0 : a.is_priority ? -1 : 1;
                });
            }
        
            setSortConfig(direction ? { column, direction } : null);
            setTableData(sortedData); 
        };
      
        return { 
            tableData,
            dataLength,
            loading, 
            error, 
            setTableData, 
            setLoading, 
            setError, 
            setDataLength, 
            sortTableData,
            sortConfig,
        };
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
            if(activeTable === 'reports'){
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

    const updateCheckboxReport = async (id: number, field: string, value: boolean) => {
        const update = {[field]: value};
        const response = await dashboardService.updateReport(id, update);
        return response;
    };

    const deleteRow = async (id: number, activeTable: string) => {
        let response;

        if(activeTable === 'reports')
            response = await dashboardService.deleteReport(id);
        else
            response = await dashboardService.deleteEmployee(id);
        return response;
        
    };
    
    const toggleReportModal = (report?: Report) => {
        if(report)
            setReport(report);
        
        setReportModalOpen(!reportModalOpen);
    };

    const toggleEmployeeModal = (employee?: Employee) => {
        if(employee)
            setFuncionario(employee);
        
        setEmployeeOpen(!employeeModalOpen);
    };

    const updateRow = async (id:number, updates: object, activeTable: string) => {
        let response;
        if(activeTable === 'reports')
            response = await dashboardService.updateReport(id, updates);
        else
            response = await dashboardService.updateEmployee(id, updates);
        
        return response;
        
    }

    return {
        reportModalOpen,
        employeeModalOpen,
        setEmployeeOpen,
        setReportModalOpen,
        activeTable,
        setActiveTable,
        report,
        employee,
        tableReportsHeaders,
        reportsColumnWidths,
        tableEmployeesHeaders,
        employeesColumnWidths,
        useTableData,
        refreshTableData,
        updateCheckboxReport,
        deleteRow,
        toggleReportModal,
        toggleEmployeeModal,
        updateRow,
    };
}

export default DashboardController;