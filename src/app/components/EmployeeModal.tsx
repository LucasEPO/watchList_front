import { useEffect } from "react";
import { Employee } from "../models/employee.interface";
import Modal from 'react-modal';
import EmployeeModalController from "../controllers/EmployeeModalController";
import { Divider, TextField } from "@mui/material";
import { textFieldStyles } from "../styles/textFieldStyles";
import { useAlert } from "../contexts/AlertContext";
import useTranslation from "next-translate/useTranslation";

interface FuncionarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleRefresh: () => void;
    employee: Employee | null;
};

const EmployeeModal: React.FC<FuncionarioModalProps> = ({ isOpen, onClose, handleRefresh, employee }) => {
    const { t } = useTranslation('common');
    const { showAlert } = useAlert();

    const {
        formData,
        setFormData,
        handleCloseModal,
        handleSubmit,
        fetchCompanyId,
    } = EmployeeModalController(onClose, handleRefresh, employee);

    useEffect(() => {
        Modal.setAppElement('main');
    }, []);

    useEffect(() => {
        fetchCompanyId();
    }, []);

    return(
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Formulário"
            className="fixed grid top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-700 p-8 rounded-lg max-w-2xl w-full"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        >
            <h1 className="text-start font-extrabold text-lg mb-3">
                {employee && employee.name ? `${t('pages.dashboard.employee-modal.title-edit', { name: employee.name })}` : `${t('pages.dashboard.employee-modal.title-new')}`}
            </h1>
            <Divider variant="middle" className="bg-white"/>
            <form onSubmit={(e) => handleSubmit(e, showAlert)}>
                <div className="grid grid-cols-12 gap-4 mb-3">
                    <TextField 
                        id="name" 
                        label={t('pages.dashboard.employee-modal.fields.name')}
                        variant="outlined" 
                        sx={textFieldStyles} 
                        className="col-span-6" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <TextField 
                        id="email" 
                        label={t('pages.dashboard.employee-modal.fields.email')}
                        variant="outlined" 
                        sx={textFieldStyles} 
                        className="col-span-6" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <Divider variant="middle" className="bg-white"/>
                <div className="flex justify-end gap-3 grid-cols-12 px-6">
                    <button 
                        onClick={handleCloseModal} 
                        type="button" 
                        className="mt-3 rounded-md px-4 py-2 font-bold text-xl bg-transparent border border-orange-500 hover:bg-orange-500 text-orange-500 hover:text-white"
                    >
                        {t('pages.dashboard.employee-modal.buttons.cancel')}
                    </button>
                    <button 
                        type="submit" 
                        className="mt-3 rounded-md px-4 py-2 font-bold text-xl bg-orange-500 hover:bg-orange-700 text-white"
                    >
                        {employee && employee.id ? t('pages.dashboard.employee-modal.buttons.edit') : t('pages.dashboard.employee-modal.buttons.save')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EmployeeModal;