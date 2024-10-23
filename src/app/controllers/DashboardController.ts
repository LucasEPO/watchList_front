import { useState, useEffect } from 'react';
import dashboardService from "../services/dashboardService";
import { Relatorio } from '../models/relatorio.interface';

const DashboardController = () => {
    const tableHeaders = ["Titulo", "Criador", "Data de Criação", "Finalizado", "Ações"];
    const columnWidths = ["30%", "20%", "15%", "10%", "15%"];
    const [modal, setModal] = useState(false);
    const [relatorio, setRelatorio] = useState<Relatorio | null>(null);

    const getTableData = async () => {
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
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const useTableData = () => {
        const [tableData, setTableData] = useState<any[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
        const [dataLength, setDataLength] = useState<number>(0);
      
        useEffect(() => {
            const loadTableData = async () => {
                try {
                const formattedData = await getTableData(); 
                    setTableData(formattedData);
                    setDataLength(formattedData.length);
                } catch (error) {
                    setError('Erro ao carregar os dados da tabela');
                } finally {
                    setLoading(false);
                }
          };
      
          loadTableData(); 
        }, []);
      
        return { tableData, dataLength, loading, error, setTableData, setLoading, setError, setDataLength };
    };

    const refreshTableData = async (
        setTableData: React.Dispatch<React.SetStateAction<any[]>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string | null>>,
        setDataLength: React.Dispatch<React.SetStateAction<number>>
    ) => {
        setTableData([]);
        setLoading(true);
        try {
            const formattedData = await getTableData();
            setTimeout(() => {
                setTableData(formattedData);
                setDataLength(formattedData ? formattedData.length : 0);
            }, 1000);
        } catch (error) {
            setError('Erro ao atualizar os dados da tabela');
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

    const deleteRelatorio = async (id: number) => {
        const response = await dashboardService.deleteRelatorio(id);
        return response;
    };
    
    const toggleModal = (relatorio?: Relatorio) => {
        if(relatorio){
            setRelatorio(relatorio);
        }
        setModal(!modal);
    }

    const updateRelatorio = async (id:number, updates: object) => {
        const response = await dashboardService.updateRelatorio(id, updates);
        return response;
    }

    return {
        modal,
        setModal,
        relatorio,
        tableHeaders,
        columnWidths,
        useTableData,
        refreshTableData,
        updateCheckboxRelatorio,
        deleteRelatorio,
        toggleModal,
        updateRelatorio,
    };
}

export default DashboardController;