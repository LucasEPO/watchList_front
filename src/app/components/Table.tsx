import TableAlert from './TableAlert';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import ExpansiveButton from '@/app/components/ExpansiveButton';
import useTranslation from 'next-translate/useTranslation';

import Filters from './Filters';

interface TableProps {
    headers: string[];  
    data: any[];
    tableTitle: string;
    activeTable: 'reports'|'employees';
    columnWidths: string[];
    dataLength: number;
    loading: boolean;   
    error: string | null;
    onRefresh?: () => void;
    onToggleModal: () => void;
    onCheckboxChange: (id: number, field: string, value: boolean)  => Promise<void>;
    onDelete: (id:number, activeTable: string) => Promise<void>;
    onEdit: (id: number, updates: object, activeTable: string) => Promise<void>;
    onSort: (key: number) => void;
    onFilter: (textFilter?: string, selectedEmployeeName?: string, selectedStatus?: any) => void;
    onClearFilters: () => void;
    sortConfig: { column: string; direction: 'asc' | 'desc' | null } | null;
}

const Table: React.FC<TableProps> = ({ headers, data, tableTitle, activeTable, columnWidths, dataLength, loading, error, onRefresh, onCheckboxChange, onDelete, onToggleModal, onEdit, onSort, onFilter, onClearFilters, sortConfig }) => {
    const { t } = useTranslation('common');

    let labelBtnNew = '';
    if(activeTable === "reports")
        labelBtnNew = t('pages.dashboard.tables.header.buttons.add-report');
    else if(activeTable === "employees")
        labelBtnNew = t('pages.dashboard.tables.header.buttons.add-employee');
        
  return (
    <div className="">
        <div className="flex flex-col p-4 bg-orange-400 rounded-t-3xl">
            <div className=" w-full flex justify-between">
                <div className="inline-block float-left text-left">
                    <p className="font-bold text-lg">{tableTitle}</p>
                    <p className="opacity-75">{dataLength} {t('pages.dashboard.tables.header.results')}</p>
                </div>
                <div className="float-right text-right">
                    <div className="inline-block mr-2 drop-shadow-2xl">
                        <ExpansiveButton 
                            icon={<FiPlus />} 
                            label={labelBtnNew} 
                            onClick={onToggleModal}
                        />
                    </div>
                    <div className="inline-block drop-shadow-2xl">
                        <ExpansiveButton 
                            icon={<FiRefreshCw />} 
                            label={t('pages.dashboard.tables.header.buttons.refresh')} 
                            onClick={onRefresh}
                        />
                    </div>
                </div>
            </div>
            <Filters onFilter={onFilter} activeTable={activeTable} onClearFilters={onClearFilters}/>
            
        </div>
        <table className="table-fixed w-full">
            <TableHeader 
                headers={headers} 
                columnWidths={columnWidths} 
                onSort={onSort}
                sortConfig={sortConfig}
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