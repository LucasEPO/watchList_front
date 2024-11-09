'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomAlert from '../components/CustomAlert';

interface AlertContextType {
  showAlert: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'warning' | 'error' | 'info'>('success');
    const [alertMessage, setAlertMessage] = useState<string>('Operação bem-sucedida!');

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const showAlert = (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertOpen(true);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <CustomAlert
                open={alertOpen}
                onClose={handleAlertClose}
                alertType={alertType}
                message={alertMessage}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert deve ser usado dentro de um AlertProvider');
    }
    return context;
};
