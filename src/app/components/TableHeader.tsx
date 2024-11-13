import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa'; // Importando os ícones

type TableHeaderProps = {
    headers: string[];
    columnWidths: string[];
    onSort: (key: number) => void;
    sortConfig: { column: string; direction: 'asc' | 'desc' | null } | null;
};

const TableHeader: React.FC<TableHeaderProps> = ({ headers, columnWidths, onSort, sortConfig }) => {
    const { t } = useTranslation("common");
    
    return (
        <thead>
            <tr>
                {headers.map((header, index) => {
                    let isSorted = false;
                    if(headers.length === 3 && sortConfig?.column){
                        isSorted = (t(`pages.dashboard.employee-table.columns.${sortConfig?.column}`).toLowerCase() === header.toLowerCase());
                    } else if (sortConfig?.column) {

                        if (sortConfig?.column === 'is_finished')
                            isSorted = (header.toLowerCase() === t('pages.dashboard.report-table.columns.finished').toLowerCase());
                        else 
                            isSorted = (t(`pages.dashboard.report-table.columns.${sortConfig?.column}`).toLowerCase() === header.toLowerCase());
                    }
                    const direction = isSorted ? sortConfig?.direction : null;

                    return (
                        <th
                            className={`relative p-4 bg-orange-500 
                                ${index !== 0 ? 'before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-orange-400' : ''}
                                ${index !== headers.length-1 ? 'cursor-pointer' : ''} 
                                h-[40px]`}
                            key={index}
                            style={{ width: columnWidths[index] }}
                            onClick={() => onSort(index)}
                        >
                            <div className="flex items-center justify-center">
                                <span className="text-lg font-bold">{header}</span>
                                {isSorted && (
                                    <div className="absolute flex items-center justify-center">
                                        {direction === 'asc' ? (
                                            <FaSortUp
                                                className="cursor-pointer text-white text-2xl mb-6"
                                            />
                                        ) : direction === 'desc' ? (
                                            <FaSortDown
                                                className="cursor-pointer text-white text-2xl mt-6"
                                            />
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
};

export default TableHeader;
