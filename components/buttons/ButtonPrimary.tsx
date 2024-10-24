import React from "react";

interface ButtonProps {
	maxWidth?: string;
	height?: string;
	label: string;
	type: string;
	disabled?: boolean;
	onClick?: () => void;
}

const ButtonPrimary: React.FC<ButtonProps> = ({
	maxWidth,
	height,
	label,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			style={{ maxWidth, height }}
			className={`
				flex flex-col justify-center items-center p-3 lg:py-4 lg:px-6 gap-2 w-full shadow-btn-shadow rounded-lg text-base font-libre-franklin font-semibold text-white bg-btn-gold hover:scale-95 duration-300`}
		>
			{label}
		</button>
	);
};

export default ButtonPrimary;
