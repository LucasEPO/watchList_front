import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import dashboardService from '../services/dashboardService';
import { Relatorio } from '../models/relatorio.interface';

interface RelatorioItem {
    id: number;
    title: string;
    funcionario: {
      name: string;
    };
    create_date: Date;
    is_finished: boolean;
    is_priority: boolean;
}

type TableRowProps = {
    item: RelatorioItem;
    columnWidths: string[];
    onCheckboxChange: (id: number, field: string, value: boolean) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onEdit: (id: number, updates: object) => Promise<void>; 
    onToggleModal: (relatorio: Relatorio) => void; 
};

interface Column<T> {
    name: string;
    value: T;
    renderer: (value: T) => JSX.Element;
}
  
const TableRow: React.FC<TableRowProps> = ({ item, columnWidths, onCheckboxChange, onDelete, onEdit, onToggleModal}) => {
    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckboxChange(item.id, field, e.target.checked); 
    };

    const handleDelete= () => {
        if (window.confirm(`Tem certeza que deseja deletar o relatório ${item.title}?`)) {
            onDelete(item.id);
        }
    };

    const handleEdit = async () => {
        const relatorio = await dashboardService.findRelatorio(item.id);
        if(!relatorio)
            window.alert(`Não foi possível retornar os dados do relatorio id:${item.id}`)
        else
            onToggleModal(relatorio);
    }

    const columns: Column<any>[] = [
        {
            name: 'title',
            value: item.title,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'criador',
            value: item.funcionario?.name,
            renderer: (value: string) => <span>{value}</span>,
        },
        {
            name: 'data de criação',
            value: item.create_date,
            renderer: (value: Date) => <span>{moment(value).format('DD/MM/YYYY')}</span>,
        },
        {
            name: 'finalizado',
            value: item.is_finished,
            renderer: (value: boolean) => (
                <Checkbox 
                    onChange={handleChange('is_finished')}
                    checked={value} 
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
                        checked={item.is_priority}
                        sx={{ padding: 0, margin: 0 }}
                    />
                    <FiEdit className="w-6 h-6 cursor-pointer" onClick={handleEdit} />
                    <FiTrash className="w-6 h-6 cursor-pointer" onClick={handleDelete}/>
                </div>
            ),
        },
    ];
  
    return (
        <tr className="even:bg-gray-100 odd:bg-white hover:bg-gray-300">
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