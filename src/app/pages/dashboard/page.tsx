'use client';

import ExpansiveButton from '@/app/components/ExpansiveButton';
import { FiSettings } from 'react-icons/fi';
import { useTableData, tableHeaders, columnWidths, refreshTableData, updateCheckboxRelatorio, deleteRelatorio } from '@/app/controllers/DashboardController';
import Table from '@/app/components/Table';


export default function Dashboard() {
  const { tableData, dataLength, loading, error, setTableData, setLoading, setError } = useTableData();

  const handleRefresh = () => {
    refreshTableData(setTableData, setLoading, setError);
  };

  const handleUpdateCheckBox = async (id: number, field: string, value: boolean) => {
    const response = await updateCheckboxRelatorio(id, field, value);
    if (response.data) {
      setTableData((prevData) =>
        prevData.map((item) => 
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    }
  };

  const handleDelete = async (id: number) => {
    const response = await deleteRelatorio(id);
    if (response.status === 200) 
      setTableData((prevData) => prevData.filter((item) => item.id !== id));
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#3f3f3f]">

      <header className="flex justify-between p-4 items-center">
        <div className="text-xl font-bold">WatchList</div>
        <div className="mr-5">
            <ExpansiveButton icon={<FiSettings/>} label="Configurações" />
        </div>
      </header>

      <main className="p-4 drop-shadow-md">
        <Table 
          headers={tableHeaders} 
          data={tableData} 
          tableTitle='Reportes de Risco'
          columnWidths={columnWidths}
          dataLength={dataLength}
          loading={loading}
          error={error}
          onRefresh={handleRefresh}
          onCheckboxChange={handleUpdateCheckBox}
          onDelete={handleDelete}
        />

      </main>
    </div>
  );
}
