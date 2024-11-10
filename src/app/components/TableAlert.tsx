import useTranslation from 'next-translate/useTranslation';
import { FaExclamation, FaSearch } from 'react-icons/fa';

interface TableAlertProps {
    error: string | null;
    loading: boolean;
    dataLength: number;
}

const TableAlert: React.FC<TableAlertProps> = ({ error, loading, dataLength }) => {
    const { t } = useTranslation('common');

    if (loading) {
        return (
            <tbody>
                <tr className="bg-gray-400 h-64">
                    <td colSpan={dataLength} className="text-center py-4 rounded-b-3xl">
                        <div className="flex justify-center">
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0s' }}>L</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>o</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>a</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>d</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>i</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>n</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>g</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.7s' }}>.</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.8s' }}>.</span>
                            <span className="text-orange-500 text-3xl font-bold h-6 inline-block animate-bounce" style={{ animationDelay: '0.9s' }}>.</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        );
    } else if (error) { 
        return (
            <tbody>
                <tr className="bg-gray-400 h-64">
                    <td colSpan={dataLength} className="text-center py-4 rounded-b-3xl">
                        <div className="flex justify-center">
                            <div className="relative drop-shadow-2xl">
                                <FaSearch className="text-orange-500 text-9xl absolute top-1/2 -translate-y-1/2 custom--translate-x-53" />
                                <div className="absolute w-96 -translate-x-32 -translate-y-12 bg-orange-500 rounded-r-2xl p-3">
                                    <p className="text-sm font-bold">{t('pages.dashboard.tables.alerts.error-title')}</p>
                                    <p className="text-sm">{t('pages.dashboard.tables.alerts.error-description')}</p>
                                </div>
                                <FaExclamation className="absolute drop-shadow-2xl top-1/2 -translate-x-44 -translate-y-7 text-red-500 text-4xl" />
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        );
    }

  return null;
};

export default TableAlert;