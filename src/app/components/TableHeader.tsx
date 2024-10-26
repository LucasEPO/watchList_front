type TableHeaderProps = {
    headers: string[];
    columnWidths: string[];
};
  
const TableHeader: React.FC<TableHeaderProps> = ({ headers, columnWidths}) => {
    return (
        <thead >
            <tr >
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