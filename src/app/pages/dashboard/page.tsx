'use client';

import ExpansiveButton from '@/app/components/ExpansiveButton';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import DashboardController from '@/app/controllers/DashboardController';
import Table from '@/app/components/Table';
import RelatorioModal from '@/app/components/RelatorioModal';
import { useRouter } from 'next/navigation';
import FuncionarioModal from '@/app/components/FuncionarioModal';


export default function Dashboard() {
  const router = useRouter(); 

  const {
    relatorioModalOpen,
    funcionarioModalOpen,
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
  } = DashboardController();

  const { 
    tableData, 
    dataLength, 
    loading, 
    error, 
    setTableData, 
    setLoading, 
    setError, 
    setDataLength
  } = useTableData(activeTable);

  const handleRefresh = () => {
      refreshTableData(setTableData, setLoading, setError, setDataLength, activeTable);
  };

  const handleUpdateReportCheckBox = async (id: number, field: string, value: boolean) => {
      const response = await updateCheckboxRelatorio(id, field, value);
      if (response.data) {
          setTableData((prevData) =>
              prevData.map((item) => 
                  item.id === id ? { ...item, [field]: value } : item
              )
          );
      }
  };

  const handleDelete = async (id: number, activeTable: string) => {
      const response = await deleteRow(id, activeTable);
          if (response.status === 200) 
              setTableData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleUpdateRow = async (id: number, updates: object, activeTable: string) => {
    try {
        const response = await updateRow(id, updates, activeTable);
        if (response.data) {
            setTableData((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, ...updates } : item
                )
            );
        }
    } catch (error) {
        console.error("Erro ao pegar a linha atualizada:", error);
    }
  };

  const logOut = () => {
    sessionStorage.clear();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#3f3f3f]">

      <header className="flex justify-between p-4 items-center">
        <div className="text-xl font-bold">WatchList</div>
        <div className="mr-5">
            <ExpansiveButton icon={<FiLogOut/>} label="Sair" onClick={logOut}/>
        </div>
      </header>

      <main className="p-4 drop-shadow-md">
        <div className="flex mb-0 justify-center">
          <button 
            onClick={() => setActiveTable('reportes')}
            className={`flex-1 p-2 border-solid border-2 border-orange-400 rounded-tl-md max-w-xs transition-colors duration-300 ease-in-out ${
              activeTable === 'reportes' ? 'bg-orange-400 text-white shadow-md' : 'text-orange-400'
            }`}
            > 
            Reportes de Risco 
          </button>
          <button 
            onClick={() => setActiveTable('funcionarios')}
            className={`flex-1 p-2 border-solid border-2 border-orange-400 rounded-tr-md max-w-xs transition-colors duration-300 ease-in-out ${
              activeTable === 'funcionarios' ? 'bg-orange-400 text-white shadow-md' : 'text-orange-400'
            }`}
            > 
            Funcionários 
          </button>
        </div>
        {activeTable === 'reportes' &&
          <Table 
            headers={tableReportsHeaders} 
            data={tableData} 
            tableTitle='Reportes de Risco'
            activeTable={activeTable}
            columnWidths={reportsColumnWidths}
            dataLength={dataLength}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onCheckboxChange={handleUpdateReportCheckBox}
            onDelete={handleDelete}
            onEdit={handleUpdateRow}
            onToggleModal={toggleRelatorioModal}
          />
        }
        {activeTable === 'funcionarios' &&
          <Table 
            headers={tableEmployeesHeaders} 
            data={tableData} 
            tableTitle='Funcionários'
            activeTable={activeTable}
            columnWidths={employeesColumnWidths}
            dataLength={dataLength}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onCheckboxChange={handleUpdateReportCheckBox}
            onDelete={handleDelete}
            onEdit={handleUpdateRow}
            onToggleModal={toggleFuncionarioModal}
          />
        }
        <RelatorioModal isOpen={relatorioModalOpen} onClose={toggleRelatorioModal} handleRefresh={handleRefresh} relatorio={relatorio} />
        <FuncionarioModal isOpen={funcionarioModalOpen} onClose={toggleFuncionarioModal} handleRefresh={handleRefresh} funcionario={funcionario} />
      </main>
    </div>
  );
}
