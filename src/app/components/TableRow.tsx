import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import dashboardService from '../services/dashboardService';
import { Relatorio } from '../models/relatorio.interface';

interface Item {
    id:number;
}
interface RelatorioItem extends Item{
    title: string;
    funcionario: {
      name: string;
    };
    create_date: Date;
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
    onToggleModal: (relatorio: Relatorio) => void; 
};

interface Column<T> {
    name: string;
    value: T;
    renderer: (value: T) => JSX.Element;
}
  
const TableRow: React.FC<TableRowProps> = ({ item, columnWidths, activeTable, onCheckboxChange, onDelete, onEdit, onToggleModal}) => {
    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckboxChange(item.id, field, e.target.checked); 
    };

    const handleDelete= () => {
        let confirmMessage = '';
        if(activeTable === 'reportes')
            confirmMessage = `Tem certeza que deseja deletar o relatório ${(item as RelatorioItem).title}?`;
        else
            confirmMessage = `Tem certeza que deseja deletar o funcionário ${(item as EmployeeItem).name}?`;
        
            if (window.confirm(confirmMessage)) {
            onDelete(item.id, activeTable);
        }
    };

    const handleEdit = async () => {
        if(activeTable === 'reportes'){
            const relatorio = await dashboardService.findRelatorio(item.id);
        
            if(!relatorio)
                window.alert(`Não foi possível retornar os dados do relatorio id:${item.id}`)
            else
                onToggleModal(relatorio);
        }else {
            const funcionario = await dashboardService.findEmployee(item.id);
        
            if(!funcionario)
                window.alert(`Não foi possível retornar os dados do funcionario id:${item.id}`)
            else
                onToggleModal(funcionario);
        }
        
    }

    const reportColumns: Column<any>[] = [
        {
            name: 'title',
            value: (item as RelatorioItem).title,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'criador',
            value: (item as RelatorioItem).funcionario?.name,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'data de criação',
            value: (item as RelatorioItem).create_date,
            renderer: (value: Date) => <span>{moment(value).format('DD/MM/YYYY')}</span>,
        },
        {
            name: 'finalizado',
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
            name: 'Ações',
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
            name: 'nome',
            value: (item as EmployeeItem).name,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'email',
            value: (item as EmployeeItem).email,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'Ações',
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
    if (activeTable === 'reportes') {
        columns = reportColumns;
    } else {
        columns = employeeColumns;
    }

    console.log(columnWidths);
  
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