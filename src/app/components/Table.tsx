import TableAlert from './TableAlert';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

interface TableProps {
    headers: string[];  
    data: any[];
    tableTitle: string;
    columnWidths: string[];
    dataLength: number;
    loading: boolean;   
    error: string | null;
    onRefresh?: () => void;
    onToggleModal: () => void;
    onCheckboxChange: (id: number, field: string, value: boolean)  => Promise<void>;
    onDelete: (id:number) => Promise<void>;
    onEdit: (id: number, updates: object) => Promise<void>;
}

const Table: React.FC<TableProps> = ({ headers, data, tableTitle, columnWidths, dataLength, loading, error, onRefresh, onCheckboxChange, onDelete, onToggleModal, onEdit }) => {
  return (
    <div className="min-w-full">
        <table className="table-fixed w-full h-full">
            <TableHeader 
                headers={headers} 
                columnWidths={columnWidths} 
                tableTitle={tableTitle} 
                dataLength={dataLength}
                onRefresh={onRefresh}
                onToggleModal={onToggleModal}
            />
            <tbody>
                {data.map((item, index) => (
                    <TableRow 
                        key={item.id} 
                        item={item} 
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