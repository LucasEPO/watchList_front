import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import dashboardService from '../services/dashboardService';
import { Report } from '../models/report.interface';
import { useAlert } from '../contexts/AlertContext';
import useTranslation from 'next-translate/useTranslation';
import { useDialog } from '../contexts/DialogContext';

interface Item {
    id:number;
}
interface RelatorioItem extends Item{
    title: string;
    funcionario: {
      name: string;
    };
    date: Date;
    is_finished: boolean;
    is_priority: boolean;
}

interface EmployeeItem extends Item {
    name: string;
    email: string;
}

type TableRowProps = {
    item: RelatorioItem | EmployeeItem;
    columnWidths: string[];
    activeTable: string;
    onCheckboxChange: (id: number, field: string, value: boolean) => Promise<void>;
    onDelete: (id: number, activeTable:string) => Promise<void>;
    onEdit: (id: number, updates: object, activeTable: string) => Promise<void>; 
    onToggleModal: (relatorio: Report) => void; 
};

interface Column<T> {
    name: string;
    value: T;
    renderer: (value: T) => JSX.Element;
}
  
const TableRow: React.FC<TableRowProps> = ({ item, columnWidths, activeTable, onCheckboxChange, onDelete, onEdit, onToggleModal}) => {
    const { t } = useTranslation('common');
    const { showAlert } = useAlert();
    const { showDialog } = useDialog();

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckboxChange(item.id, field, e.target.checked); 
    };

    const handleDelete = () => {
        let confirmMessage = '';
    
        if (activeTable === 'reports') 
            confirmMessage = `${t('pages.dashboard.tables.alerts.report.delete', {title: (item as RelatorioItem).title})}`;
        else 
            confirmMessage = `${t('pages.dashboard.tables.alerts.employee.delete', {name: (item as EmployeeItem).name})}`;
        
        showDialog(2, confirmMessage, () => {
            onDelete(item.id, activeTable);
    
            let successMessage = '';
            if (activeTable === 'reports') 
                successMessage = `${t('pages.dashboard.tables.alerts.report.delete-success', {title: (item as RelatorioItem).title})}`;
            else 
                successMessage = `${t('pages.dashboard.tables.alerts.employee.delete-success', {name: (item as EmployeeItem).name})}`;
            
            showAlert("success", successMessage);
        });
    };

    const handleEdit = async () => {
        try{
            if(activeTable === 'reports'){
                const relatorio = await dashboardService.findReport(item.id);
            
                if(relatorio)
                    onToggleModal(relatorio);
                
            }else {
                const funcionario = await dashboardService.findEmployee(item.id);
                
                if(funcionario)
                    onToggleModal(funcionario);
            }
        } catch (error: any) {
            let errorMessage = '';

            switch (error.code) {
                case 'ERROR_NOT_FOUND':
                    if(activeTable  === 'reports')
                        errorMessage = `${t('pages.dashboard.tables.alerts.report.error-id', {id:item.id})}`;
                    else
                        errorMessage = `${t('pages.dashboard.tables.alerts.employee.error-id', {id:item.id})}`;

                    break;
                case 'ERROR_FETCHING':
                default:
                    if(activeTable  === 'reports')
                        errorMessage = t('pages.dashboard.service-alerts.reports.find-one');
                    else
                        errorMessage = t('pages.dashboard.service-alerts.employees.find-one');
                    break;
            }
            showAlert("error", errorMessage);
        }
        
    }

    const reportColumns: Column<any>[] = [
        {
            name: 'title',
            value: (item as RelatorioItem).title,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'creator',
            value: (item as RelatorioItem).funcionario?.name,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'date',
            value: (item as RelatorioItem).date,
            renderer: (value: Date) => <span>{moment(value).format('DD/MM/YYYY')}</span>,
        },
        {
            name: 'fininished',
            value: (item as RelatorioItem).is_finished,
            renderer: (value: boolean) => (
                <Checkbox 
                    onChange={handleChange('is_finished')}
                    checked={value !== undefined ? value : false}
                    sx={{
                    '&.Mui-checked': {
                        color: "#f97316",
                    },
                }} 
                />
            ),
        },
        {
            name: 'actions',
            value: item,
            renderer: (item: RelatorioItem) => (
                <div className="flex justify-between mx-4">
                    <Checkbox
                        onChange={handleChange('is_priority')}
                        icon={<HiOutlineStar className="text-black w-6 h-6 cursor-pointer" />}
                        checkedIcon={<HiStar className="text-yellow-400 w-6 h-6 cursor-pointer" />}
                        checked={item.is_priority !== undefined ? item.is_priority : false}
                        sx={{ padding: 0, margin: 0 }}
                    />
                    <FiEdit className="w-6 h-6 cursor-pointer" onClick={handleEdit} />
                    <FiTrash className="w-6 h-6 cursor-pointer" onClick={handleDelete}/>
                </div>
            ),
        },
    ];

    const employeeColumns: Column<any>[] = [
        {
            name: 'name',
            value: (item as EmployeeItem).name,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'email',
            value: (item as EmployeeItem).email,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'actions',
            value: item,
            renderer: (item: EmployeeItem) => (
                <div className="flex justify-between mx-4">
                    <FiEdit className="w-6 h-6 cursor-pointer" onClick={handleEdit} />
                    <FiTrash className="w-6 h-6 cursor-pointer" onClick={handleDelete}/>
                </div>
            ),
        },
    ];

    let columns;
    if (activeTable === 'reports') {
        columns = reportColumns;
    } else {
        columns = employeeColumns;
    }

    return (
        <tr className="even:bg-gray-100 odd:bg-white hover:bg-gray-300 ">   
            {columns.map((column, index) => (
                <td
                    key={index}
                    className="p-4 text-center text-black"
                    style={{ width: columnWidths[index] }}
                >
                    {column.renderer(column.value)}
                </td>
            ))}
        </tr>
    );
  };
  
  export default TableRow;