'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import { textFieldStyles } from '../styles/textFieldStyles.js';

function useSetLanguage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	return (locale: string) => {
		const current = new URLSearchParams(Array.from(searchParams.entries()));

		current.set('lang', locale);

		const query = current.toString();
		const queryString = query ? `?${query}` : '';

		if (queryString !== window.location.search) {
			router.push(`${pathname}${queryString}`);
		}
	};
}

const LanguageSelector = () => {
	const { t } = useTranslation('common');
	const { lang } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState<string>('en'); // 'en' como padrão
	const setLanguage = useSetLanguage();

	const languageOptions = [
		{ id: 'en', name: 'English' },
		{ id: 'pt-BR', name: 'Português' },
	];

	useEffect(() => {
		const savedLanguage = localStorage.getItem('language');
		if (savedLanguage && savedLanguage !== selectedLanguage) {
			setSelectedLanguage(savedLanguage);
			setLanguage(savedLanguage);
		} else if (!savedLanguage) {
			localStorage.setItem('language', 'en');
		}
	}, [setLanguage, selectedLanguage]);

	const handleChangeLanguage = (event: any, newValue: { id: string; name: string } | null) => {
		if (newValue && newValue.id !== selectedLanguage) {
			setLoading(true);
			setLanguage(newValue.id);
			localStorage.setItem('language', newValue.id); 
			setSelectedLanguage(newValue.id);
			setLoading(false);
		}
	};

	return (
		<Autocomplete
			disableClearable
			id="language-selector"
			sx={{
				width: 'auto',
			}}
			options={languageOptions}
			getOptionLabel={(option) => option.name}
			value={languageOptions.find(option => option.id === selectedLanguage) || undefined}
			onChange={handleChangeLanguage}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			renderInput={(params) => (
				<TextField
					sx={{
						...textFieldStyles,
						width: 'auto',
						minWidth: '200px',
					}}
					{...params}
					label={t('app.language')}
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
	);
};

export default LanguageSelector;
