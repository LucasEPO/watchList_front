import { FaFilter } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { Autocomplete, Checkbox, CircularProgress, Divider, FormControl, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import { useAlert } from '../contexts/AlertContext';
import FiltersController from '../controllers/FiltersController';
import { filtersStyles } from '../styles/filtersStyles';
import useTranslation from 'next-translate/useTranslation';
import ExpansiveButton from '@/app/components/ExpansiveButton';
import { RiFilterOffLine } from "react-icons/ri";

interface FiltersProps {
    activeTable: 'reports'|'employees';
    onFilter: (textFilter?: string, selectedEmployeeName?: string, selectedStatus?: any) => void;
    onClearFilters: () => void;
};

interface AutocompleteOption {
    id: number;
    name: string;
};

const ITEM_HEIGHT = 52;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const Filters: React.FC<FiltersProps> = ({ activeTable, onFilter, onClearFilters }) => {
    const { t } = useTranslation("common");
    const { showAlert } = useAlert();
    
    const [enterPressed, setEnterPressed] = useState(false);

    const {
        textFilter,
        setTextFilter,
        selectedEmployee,
        setSelectedEmployee,
        autocompleteEmployeeOpen,
        employeeOptions,
        loading,
        handleAutocompleteClose,
        handleAutocompleteOpen,
        statusOptions,
        selectedStatusOptions,
        handleStatusChange,
        selectedStatusLabels,
        handleClearFilters,
    } = FiltersController(onClearFilters);

    useEffect(() => {
        if(enterPressed) return;
        const delay = setTimeout(() => {
            onFilter(textFilter, selectedEmployee?.name, selectedStatusOptions);
        }, 3000);

        return () => clearTimeout(delay);
    }, [textFilter, enterPressed]);

    useEffect (() => {
        onFilter(textFilter, selectedEmployee?.name, selectedStatusOptions);
    }, [selectedStatusOptions])

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            setEnterPressed(true);  
            onFilter(textFilter, selectedEmployee?.name, selectedStatusOptions); 
        } else {
            setEnterPressed(false);
        }
    };

    return (
        <div className="flex mt-3 rounded-md text-left items-center bg-orange-300 px-5 py-2 w-full drop-shadow-lg">
            <FaFilter className="text-2xl mr-4"/>
            <Divider variant='middle' orientation='vertical' flexItem className="bg-orange-500" sx={{ marginRight: '1.25rem'}}/>
            <div className="flex gap-4 items-center w-full">
                <TextField
                    variant="outlined"
                    placeholder={activeTable === 'reports' ? t('pages.dashboard.tables.filters.title') : t('pages.dashboard.tables.filters.name')}
                    value={textFilter}
                    onChange={(e) => setTextFilter(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{...filtersStyles, minidth: '25%'}}
                />
                {activeTable === 'reports' &&
                    <Autocomplete
                        id="employeeFilter"
                        sx={{width:'18%'}}
                        open={autocompleteEmployeeOpen}
                        onOpen={() => handleAutocompleteOpen(showAlert)}
                        onClose={handleAutocompleteClose}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.name}
                        options={employeeOptions}
                        loading={loading}
                        value={selectedEmployee || null} 
                        onChange={(event, newValue: AutocompleteOption | null) => {
                            setSelectedEmployee(newValue); 
                            onFilter(textFilter, newValue?.name, selectedStatusOptions);
                        }}
                        renderInput={(params) => (
                            <TextField
                                sx={{...filtersStyles}}
                                {...params}
                                placeholder={t('pages.dashboard.tables.filters.creator')}
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
                }
                {activeTable === 'reports' &&
                    <FormControl
                        sx={{ ...filtersStyles, minWidth: '20%' }}
                    >
                        <Select
                            id="statusFilter"
                            multiple
                            value={selectedStatusLabels}
                            onChange={handleStatusChange}
                            renderValue={(selected) => 
                                selected.length === 0 ? <span style={{ opacity: 0.5 }}>{t ('pages.dashboard.tables.filters.status.default')}</span> : selected.join(', ') 
                            }
                            displayEmpty
                            MenuProps={MenuProps}
                            sx={{filtersStyles}}
                        >
                            <MenuItem disabled value="">
                                <em>{t ('pages.dashboard.tables.filters.status.label')}</em>
                            </MenuItem>
                    
                            {statusOptions.map((option) => (
                                <MenuItem
                                    key={option.label}
                                    value={option.label}
                                    disabled={
                                        (option.field === 'is_finished' &&
                                        selectedStatusOptions.finished !== null &&
                                        selectedStatusOptions.finished !== option.value) ||
                                        (option.field === 'is_priority' &&
                                        selectedStatusOptions.priority !== null &&
                                        selectedStatusOptions.priority !== option.value)
                                    }
                                >
                                    <Checkbox
                                        checked={
                                        (option.field === 'is_finished' && selectedStatusOptions.finished === option.value) ||
                                        (option.field === 'is_priority' && selectedStatusOptions.priority === option.value)
                                        }
                                        sx={{
                                            '&.Mui-checked': {
                                                color: "#f97316",
                                            },
                                        }}
                                    />
                                    <ListItemText primary={option.label} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
                
            </div>
            <div className="flex align-middle w-fit">
                <Divider variant='middle' orientation='vertical' flexItem className="bg-orange-500" sx={{ marginRight: '1.25rem'}}/>

                <ExpansiveButton 
                    icon={<RiFilterOffLine />} 
                    label={t('pages.dashboard.tables.filters.clear')} 
                    onClick={handleClearFilters}
                    notRotate={true}
                />
            </div>
        </div>
    );
};

export default Filters;