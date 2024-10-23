export const textFieldStyles = {
    marginTop: '0.75rem',
    color: 'white',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FBBF24', // change border color
      },
      '&:hover fieldset': {
        borderColor: '#F97316', // change border color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#F97316', // change border color on focus
      },
      '&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
        borderColor: '#F97316', // change outline color on hover
      },
    },
    '& .MuiInputBase-input': {
      color: 'white', // change text color
    },
    '& .MuiFormLabel-root': {
      color: '#CCC', // change label color
    },
    '& .MuiFormLabel-root.Mui-focused': {
      color: '#FBBF24', // change label color on focus
    },
    '& .MuiIconButton-root': {
      color: 'white', // change icon color
    },
};