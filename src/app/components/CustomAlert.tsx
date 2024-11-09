import React, { useEffect } from 'react';
import { Snackbar, Alert, AlertTitle, Fade } from '@mui/material';

interface CustomAlertProps {
    open: boolean;
    onClose: () => void;
    alertType: 'success' | 'warning' | 'error' | 'info';
    message: string;
    duration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    open,
    onClose,
    alertType,
    message,
    duration = 3000,
}) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [open, onClose, duration]);

    return (
        <Fade in={open}>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
                onClose={onClose}
                sx={{ marginBottom: '20px', marginLeft: '20px' }}
            >
                <Alert
                    variant="filled"
                    onClose={onClose}
                    severity={alertType}
                    sx={{ width: '100%' }}
                >
                    <AlertTitle>{alertType.charAt(0).toUpperCase() + alertType.slice(1)}</AlertTitle>
                    {message}
                </Alert>
            </Snackbar>
        </Fade>
    );
};

export default CustomAlert;