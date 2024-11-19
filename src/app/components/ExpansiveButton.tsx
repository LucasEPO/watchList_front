import { useEffect, useState } from 'react';

interface ExpansiveButtonProps {
	icon: React.ReactNode; 
	label: string;
	onClick?: () => void;
	notRotate?: boolean;
}

const ExpansiveButtonProps:React.FC<ExpansiveButtonProps> = ({ icon, label, onClick, notRotate }) => {
	const [hovered, setHovered] = useState(false);
	const [textVisible, setTextVisible] = useState(false); 

	useEffect(() => {
		if (hovered) {
			setTextVisible(true);
		} else {
			const timer = setTimeout(() => {
				setTextVisible(false); 
			}, 200);

			return () => clearTimeout(timer);
		}
	}, [hovered]);

	return (
		<button
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className={`flex items-center bg-orange-500 text-white p-4 rounded-full transition-all duration-700 ease-in-out overflow-hidden max-h-14 ${
				hovered ? 'w-48' : 'w-14'
			}`}
			style={{ transformOrigin: 'right center' }}
			onClick={onClick}
		>
			<span className={`text-2xl transition-transform duration-1000 ${(hovered && !notRotate) ? 'rotate-180' : 'rotate-0'}`} >
				{icon}
			</span>
			<span
				className={`ml-2 font-semibold transition-transform duration-1000 whitespace-nowrap ${
					hovered ? 'translate-x-0 min-w-max' : 'translate-x-5 min-w-0'
				} ' ' ${
					textVisible ? 'opacity-100': 'opacity-0 hidden'
				}`}
			>
				{label}
			</span>
		</button>
	);
};

export default ExpansiveButtonProps;