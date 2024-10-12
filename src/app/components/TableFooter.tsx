import { FaChevronUp } from 'react-icons/fa';

interface TableFooterProps {
    headerLength: number; 
}

const TableFooter: React.FC<TableFooterProps> = ({ headerLength }) => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0, 
            behavior: 'smooth'
        });
    };

    return (
        <tfoot className="w-full">
            <tr>
                <td colSpan={headerLength} className="p-0">
                    <div 
                        className="bg-orange-400 p-4 rounded-b-3xl flex justify-center items-center cursor-pointer"
                        onClick={scrollToTop}
                    >
                        <FaChevronUp className="text-white" />  
                    </div>
                </td>
            </tr>
        </tfoot>
    );
};

export default TableFooter;
