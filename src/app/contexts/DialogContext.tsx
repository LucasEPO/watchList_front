'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomDialog from '../components/CustomDialog';

interface DialogContextType {
  showDialog: (numberOfOptions: number, message: string, onConfirm?: () => void) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<number>(2);
    const [dialogMessage, setAlertMessage] = useState<string>('Confirme sua ação!');
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | undefined>(undefined);

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleConfirm = () => {
        if (onConfirmCallback) 
            onConfirmCallback(); 
        setDialogOpen(false);
    };

    const showDialog = (numberOfOptions: number, message: string,  onConfirm?: () => void) => {
        setDialogType(numberOfOptions);
        setAlertMessage(message);
        setOnConfirmCallback(() => onConfirm);
        setDialogOpen(true);
    };

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {children}
            <CustomDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                dialogType={dialogType}
                message={dialogMessage}
                onConfirm={handleConfirm}
            />
        </DialogContext.Provider>
    );
};

export const useDialog = (): DialogContextType => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog should be used inside a AlertProvider');
    }
    return context;
};
