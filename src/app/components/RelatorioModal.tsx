import { Autocomplete, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { textFieldStyles } from '../styles/textFieldStyles.js';
import { radioBtnStyles } from '../styles/radioBtnStyles.js';
import { radioGroupFormControlStyles } from '../styles/radioGroupFormControlStyles.js';
import { formLabelStyles } from '../styles/formLabelStyles.js';
import moment from 'moment';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import RelatorioModalController from '../controllers/RelatorioModalController';
import { Relatorio } from '../models/relatorio.interface.js';

interface RelatorioModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleRefresh: () => void;
    relatorio: Relatorio | null;
}

const RelatorioModal: React.FC<RelatorioModalProps> = ({ isOpen, onClose, handleRefresh, relatorio }) => {
    const {
        autocompleteOpen,
        formData,
        setFormData,
        options,
        loading,
        isPriority,
        isFinished,
        workshift,
        handleChange,
        handleSubmit,
        handleCloseModal,
        handleAutocompleteClose,
        handlePriorityChange,
        handleFinishedChange,
        handleAutocompleteOpen,
        fetchEnterpriseId,
    } = RelatorioModalController(onClose, handleRefresh, relatorio);

    useEffect(() => {
        Modal.setAppElement('main');
    }, []);

    useEffect(() => {
        fetchEnterpriseId();
    }, []);

    return (
        <Modal
          isOpen={isOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Formulário"
          className="fixed grid top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-700 p-8 rounded-lg max-w-2xl w-full"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        >
            <h1 className="text-start font-extrabold text-lg mb-3">
                {relatorio && relatorio.title ? `Editar: ${relatorio.title}` : 'Novo Reporte de Risco'}
            </h1>
            <Divider variant="middle" className="bg-white"/>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 mb-3 gap-4">
                    <TextField 
                        id="title" 
                        label="Título" 
                        variant="outlined" 
                        sx={textFieldStyles} 
                        className="col-span-5" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <div className="col-span-7">
                        <Autocomplete
                            id="employee"
                            sx={{ width: "100%" }}
                            open={autocompleteOpen}
                            onOpen={handleAutocompleteOpen}
                            onClose={handleAutocompleteClose}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={(option) => option.name}
                            options={options}
                            loading={loading}
                            value={options.find(option => option.id === formData.employeeId) || null}
                            onChange={(event, newValue: any) => {
                                setFormData({ ...formData, employeeId: newValue ? newValue.id : null });
                            }}
                            renderInput={(params) => (
                                <TextField
                                sx={textFieldStyles}
                                {...params}
                                label="Funcionário"
                                required
                                slotProps={{
                                    input: {
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                    },
                                }}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-12 mb-3 gap-4">
                    <TextField 
                        id="department" 
                        label="Área" 
                        variant="outlined" 
                        sx={textFieldStyles} 
                        className="col-span-7" 
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                    <TextField 
                        id="equipament" 
                        label="Equipamento" 
                        variant="outlined" 
                        sx={textFieldStyles} 
                        className="col-span-5" 
                        value={formData.equipment}
                        onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-10 mb-3 gap-4">
                    <div className="col-span-3 border rounded-md hover-border flex flex-col justify-center items-center mt-3" >
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    icon={<HiOutlineStar className="w-7 h-7 cursor-pointer outlined-star"/>}
                                    checkedIcon={<HiStar className="text-yellow-400 w-7 h-7 cursor-pointer" />}
                                    checked={isPriority} 
                                    onChange={handlePriorityChange}  
                                />
                            }
                            label="Prioridade"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={isFinished} 
                                    onChange={handleFinishedChange} 
                                    sx={{
                                        '&.Mui-checked': {
                                            color: "#F97316",
                                        }, '&': {
                                            color: "#FBBF24"
                                        }, '&:hover' : {
                                            color: "#F97316"
                                        }
                                    }}
                                />
                            }
                            label="Finalizado"
                        />
                    </div>
                    <div className="flex flex-col col-span-3 justify-around">
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker 
                                label="Data"
                                format='DD/MM/YYYY' 
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e || moment() })}
                                className="col-span-3 self-center"
                                sx={{...textFieldStyles,
                                    '& .MuiInputLabel-root': {
                                        color: '#FBBF24', 
                                    },
                                }} 
                            />
                        </LocalizationProvider>
                        {isFinished && (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker 
                                label="Data de finalização"
                                defaultValue={moment()} 
                                format='DD/MM/YYYY' 
                                value={formData.finishDate}
                                onChange={(e) => setFormData({ ...formData, finishDate: e || moment() })}
                                className="col-span-3 self-center"
                                sx={{...textFieldStyles,
                                    '& .MuiInputLabel-root': {
                                        color: '#FBBF24', 
                                    },
                                }} 
                            />
                        </LocalizationProvider>
                        )}
                    </div>
                    <FormControl sx={radioGroupFormControlStyles} className="col-span-4 flex justify-around">
                        <FormLabel id="workshift-label" sx={formLabelStyles}>Turno</FormLabel>
                        <RadioGroup
                            id="workshift-radiogroup"
                            name="controlled-radio-buttons-group"
                            aria-labelledby="workshift-label"
                            value={workshift}
                            onChange={handleChange}
                            sx={{
                                borderColor: "#FBBF24",
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}
                        >
                            <FormControlLabel value="1" control={<Radio sx={radioBtnStyles}/>} label="1°" />
                            <FormControlLabel value="2" control={<Radio sx={radioBtnStyles}/>} label="2°" />
                            <FormControlLabel value="3" control={<Radio sx={radioBtnStyles}/>} label="3°" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className="grid grid-cols-12 mb-3">
                    <TextField 
                        id="description"
                        multiline
                        maxRows={4}
                        label="Descrição" 
                        variant="outlined"
                        required
                        sx={textFieldStyles}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="col-span-12" 
                    />
                </div>
                <div className="grid grid-cols-12 mb-3 gap-4">
                    <TextField 
                        id="preventionAction"
                        multiline
                        maxRows={4}
                        label="O que foi feito para evitar ser um acidente?" 
                        variant="outlined" 
                        value={formData.preventionAction}
                        onChange={(e) => setFormData({ ...formData, preventionAction: e.target.value })}
                        className="col-span-6" 
                        sx={{
                            ...textFieldStyles,
                            '& .MuiInputLabel-root': {
                                fontSize: '0.85rem',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                fontSize: '1rem',
                            }
                        }} 
                        
                    />
                    <TextField 
                        id="riskAction"
                        multiline
                        maxRows={4}
                        label="Algo pode ser feito para eliminar o risco?" 
                        variant="outlined" 
                        value={formData.riskAction}
                        onChange={(e) => setFormData({ ...formData, riskAction: e.target.value })}
                        className="col-span-6" 
                        sx={{
                            ...textFieldStyles,
                            '& .MuiInputLabel-root': {
                                fontSize: '0.85rem',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                fontSize: '1rem',
                            }
                        }} 
                    />
                </div>
                <Divider variant="middle" className="bg-white"/>
                <div className="flex justify-end gap-3 grid-cols-12 px-6">
                    <button onClick={handleCloseModal} type="button" className="mt-3 rounded-md px-4 py-2 font-bold text-xl bg-transparent border border-orange-500 hover:bg-orange-500 text-orange-500 hover:text-white">Cancelar</button>
                    <button type="submit" className="mt-3 rounded-md px-4 py-2 font-bold text-xl bg-orange-500 hover:bg-orange-700 text-white">
                        {relatorio && relatorio.id ? 'Editar': 'Salvar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default RelatorioModal;