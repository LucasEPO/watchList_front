import TableAlert from './TableAlert';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import ExpansiveButton from '@/app/components/ExpansiveButton';

interface TableProps {
    headers: string[];  
    data: any[];
    tableTitle: string;
    activeTable: string;
    columnWidths: string[];
    dataLength: number;
    loading: boolean;   
    error: string | null;
    onRefresh?: () => void;
    onToggleModal: () => void;
    onCheckboxChange: (id: number, field: string, value: boolean)  => Promise<void>;
    onDelete: (id:number, activeTable: string) => Promise<void>;
    onEdit: (id: number, updates: object, activeTable: string) => Promise<void>;
}

const Table: React.FC<TableProps> = ({ headers, data, tableTitle, activeTable, columnWidths, dataLength, loading, error, onRefresh, onCheckboxChange, onDelete, onToggleModal, onEdit }) => {
    let labelBtnNew = '';
    if(activeTable === "reportes")
        labelBtnNew = "Novo Reporte"
    else if(activeTable === "funcionarios")
        labelBtnNew = "Novo Funcionário"
        
  return (
    <div className="">
        <div className="p-4 bg-orange-400 rounded-t-3xl w-full flex justify-between">
            <div className="inline-block float-left text-left">
                <p className="font-bold text-lg">{tableTitle}</p>
                <p className="opacity-75">{dataLength} Resultados</p>
            </div>
            <div className="float-right text-right">
                <div className="inline-block mr-2 drop-shadow-2xl">
                    <ExpansiveButton icon={<FiPlus />} label={labelBtnNew} onClick={onToggleModal}/>
                </div>
                <div className="inline-block drop-shadow-2xl">
                    <ExpansiveButton icon={<FiRefreshCw />} label="Atualizar Tabela" onClick={onRefresh}/>
                </div>
            </div>
        </div>
        <table className="table-fixed w-full">
            <TableHeader 
                headers={headers} 
                columnWidths={columnWidths} 
            />
            <tbody >
                {data.map((item, index) => (
                    <TableRow 
                        key={item.id} 
                        item={item} 
                        activeTable={activeTable}
                        columnWidths={columnWidths} 
                        onCheckboxChange={onCheckboxChange} 
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onToggleModal={onToggleModal}
                    />
                ))}
            </tbody>
            <TableAlert loading={loading} error={error} dataLength={headers.length} />
            {!loading && !error && (
                <TableFooter headerLength={headers.length}/>
            )}
        </table>
    </div>
  );
};

export default Table;