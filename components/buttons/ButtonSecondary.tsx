import React from "react";

interface ButtonProps {
	label: string;
	type: string;
	disabled?: boolean;
	onClick?: () => void;
}

const ButtonSecondary: React.FC<ButtonProps> = ({ label, onClick }) => {
	return (
		<button
			onClick={onClick}
			className={`
				flex flex-col justify-center items-center py-2 px-3 sm:p-3 2xl:py-4 2xl:px-6 gap-2 w-full shadow-btn-shadow rounded-lg text-base font-libre-franklin font-semibold border border-gold-text text-gold-text hover:text-white hover:bg-btn-gold duration-300`}
		>
			{label}
		</button>
	);
};

export default ButtonSecondary;
