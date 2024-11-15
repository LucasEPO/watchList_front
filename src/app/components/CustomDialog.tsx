import useTranslation from "next-translate/useTranslation";

interface CustomDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    dialogType: number;
    message: string;
}
  
const CustomDialog: React.FC<CustomDialogProps> = ({ open, onClose, onConfirm, dialogType, message }) => {
    const { t } = useTranslation("common");

    if (!open) return null;
  
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className=" bg-gray-700 p-6 rounded-md shadow-md max-w-sm w-full">
                <p className="text-lg">{message}</p>
                <div className="mt-4 flex justify-end space-x-2">
                    {dialogType === 2 && (
                        <button onClick={onClose} className="bg-gray-700 text-orange-400 px-4 py-2 rounded bg-transparent border border-orange-500 hover:text-orange-500 hover:border-orange-600">
                            {t("pages.dashboard.dialog.cancel")}
                        </button>
                    )}
                    <button onClick={onConfirm} className="bg-orange-500 px-4 py-2 rounded text-white hover:bg-orange-600">
                        {dialogType === 1 ? t("pages.dashboard.dialog.ok") : t("pages.dashboard.dialog.confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomDialog;