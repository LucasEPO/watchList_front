export const filtersStyles = {
	'& .MuiOutlinedInput-root': {
		height: '100%',
		borderRadius: '16px', // Bordas arredondadas (rounded-2xl)
		paddingLeft: '4px', // Padding interno equivalente a pl-4
		fontSize: '1.125rem', // Tamanho do texto (text-lg)
		color: '#000000', // Cor do texto preto
		backgroundColor: '#FFF',
		borderColor: '#F97316',
		'&.Mui-focused fieldset': {
			borderColor: '#FFF', // Cor do outline em foco (orange-300)
		},
		'& fieldset': {
			borderColor: '#FFF', // Cor do outline padrão (yellow-400)
		},
		'&:hover fieldset': {
			borderColor: '#FFF', // Cor do outline ao passar o mouse (orange-300)
		},
	},
	'& .MuiOutlinedInput-input': {
		color: '#000', // Cor do texto preta
	},
	'& .MuiOutlinedInput-input::placeholder': {
		color: '#000'
	},
	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: '#FBBF24', // Cor da borda padrão (outline)
	},
};