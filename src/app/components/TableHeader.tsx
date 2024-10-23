import { FiPlus, FiRefreshCw } from "react-icons/fi";
import ExpansiveButton from '@/app/components/ExpansiveButton';

type TableHeaderProps = {
    headers: string[];
    columnWidths: string[];
    tableTitle: string;
    dataLength: number;
    onRefresh?: () => void;
    onToggleModal?: () => void;
};
  
const TableHeader: React.FC<TableHeaderProps> = ({ headers, columnWidths, tableTitle, dataLength, onRefresh, onToggleModal }) => {

    return (
        <thead className="w-full shadow-inner">
            <tr >
                <th colSpan={headers.length} className="p-4 bg-orange-400 rounded-t-3xl w-full">
                    <div className="inline-block float-left text-left">
                        <p className="font-bold text-lg">{tableTitle}</p>
                        <p className="opacity-75">{dataLength} Resultados</p>
                    </div>
                    <div className="float-right">
                        <div className="inline-block mr-2 drop-shadow-2xl">
                            <ExpansiveButton icon={<FiPlus />} label="Novo Reporte" onClick={onToggleModal}/>
                        </div>
                        <div className="inline-block drop-shadow-2xl">
                            <ExpansiveButton icon={<FiRefreshCw />} label="Atualizar Tabela" onClick={onRefresh}/>
                        </div>
                    </div>
                </th>
            </tr>
            <tr className="w-full text-center" >
                {headers.map((header, index) => (
                    <th className={`relative p-4 bg-orange-500
                        ${index !== 0 ? 'before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-orange-400' : ''} 
                    `}
                    key={index}
                    style={{ width: columnWidths[index] }}
                    >
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};
  
export default TableHeader;