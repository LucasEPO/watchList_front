'use client';

import ExpansiveButton from '@/app/components/ExpansiveButton';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import DashboardController from '@/app/controllers/DashboardController';
import Table from '@/app/components/Table';
import RelatorioModal from '@/app/components/RelatorioModal';
import { useRouter } from 'next/navigation';
import FuncionarioModal from '@/app/components/FuncionarioModal';
import useTranslation from 'next-translate/useTranslation';
import { useAlert } from '@/app/contexts/AlertContext';
import dynamic from 'next/dynamic';

const LanguageSelector = dynamic(() => import("@/app/components/languageSelector"), {
  ssr: false
});

export default function Dashboard() {
  const { t } = useTranslation('commom');
  const { showAlert } = useAlert();
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
      try{
        const response = await updateCheckboxRelatorio(id, field, value);
        if (response.data) {
            setTableData((prevData) =>
                prevData.map((item) => 
                    item.id === id ? { ...item, [field]: value } : item
                )
            );
        }
      } catch (error: any) {
        let errorMessage = '';

        switch (error.code) {
            case 'ERROR_UPDATE':
            default:
                errorMessage = t('pages.dashboard.service-alerts.reports.update');
                break;
        }

        showAlert("error", errorMessage);
      }
  };

  const handleDelete = async (id: number, activeTable: string) => {
    try{
      const response = await deleteRow(id, activeTable);
          if (response.status === 200) 
              setTableData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error: any) {
          let errorMessage = '';

          switch (error.code) {
              case 'ERROR_DELETE':
              default:
                  if(activeTable === 'reportes')
                      errorMessage = t('pages.dashboard.service-alerts.reports.delete');
                  else
                      errorMessage = t('pages.dashboard.service-alerts.employees.delete');
                  break;
          }

          showAlert("error", errorMessage);
      }
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
    } catch (error: any) {
        let errorMessage = '';

        switch (error.code) {
            case 'ERROR_UPDATE':
            default:
                if(activeTable === 'reportes')
                    errorMessage = t('pages.dashboard.service-alerts.reports.delete');
                else
                    errorMessage = t('pages.dashboard.service-alerts.employees.delete');
                break;
        }

        showAlert("error", errorMessage);
    }
  };

  const logOut = () => {
    sessionStorage.clear();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#3f3f3f]">

      <header className="flex justify-between p-4 items-center">
        <div className="text-xl font-bold">{t('app.watchlist')}</div>
        <div className="flex items-center mr-5">
            <div className="mr-3 -mt-2">
              <LanguageSelector />
            </div>
            <ExpansiveButton icon={<FiLogOut/>} label={t('pages.dashboard.logout')} onClick={logOut}/>
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
            {t('pages.dashboard.report-table.title')}
          </button>
          <button 
            onClick={() => setActiveTable('funcionarios')}
            className={`flex-1 p-2 border-solid border-2 border-orange-400 rounded-tr-md max-w-xs transition-colors duration-300 ease-in-out ${
              activeTable === 'funcionarios' ? 'bg-orange-400 text-white shadow-md' : 'text-orange-400'
            }`}
            > 
            {t('pages.dashboard.employee-table.title')}
          </button>
        </div>
        {activeTable === 'reportes' &&
          <Table 
            headers={tableReportsHeaders} 
            data={tableData} 
            tableTitle={t('pages.dashboard.report-table.title')}
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
            tableTitle={t('pages.dashboard.employee-table.title')}
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
        <RelatorioModal 
          isOpen={relatorioModalOpen} 
          onClose={toggleRelatorioModal}
          handleRefresh={handleRefresh} 
          relatorio={relatorio} 
        />
        <FuncionarioModal 
          isOpen={funcionarioModalOpen} 
          onClose={toggleFuncionarioModal} 
          handleRefresh={handleRefresh} 
          funcionario={funcionario} 
        />
      </main>
    </div>
  );
}
