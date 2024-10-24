import React from "react";

interface ButtonProps {
	backgroundColor?: string;
	label: string;
	type: string;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
	backgroundColor = "#919191", // Default color
	label,
	className,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			style={{ backgroundColor }}
			className={`flex flex-col justify-center items-center py-4 px-6 gap-2 shadow-btn-shadow rounded-lg text-base font-libre-franklin font-semibold text-white transition duration-300 ease-in-out hover:bg-btn-gold focus:bg-btn-gold w-full ${className}`}
		>
			{label}
		</button>
	);
};

export default Button;
