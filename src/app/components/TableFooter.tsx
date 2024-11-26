interface TableFooterProps {
    headerLength: number; 
}

const TableFooter: React.FC<TableFooterProps> = ({ headerLength }) => {

    return (
        <tfoot className="w-full">
            <tr>
                <td colSpan={headerLength} className="p-0">
                    <div 
                        className="bg-orange-400 p-4 rounded-b-3xl flex justify-center items-center cursor-pointer"
                    >
                    </div>
                </td>
            </tr>
        </tfoot>
    );
};

export default TableFooter;
