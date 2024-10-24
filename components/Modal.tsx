"use client";

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import ButtonPrimary from "../components/buttons/ButtonPrimary";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	heading: string;
	buttonLabel: string;
	paragraphText: string;
	src: string;
}

const Modal: FC<ModalProps> = ({
	isOpen,
	onClose,
	heading,
	buttonLabel,
	paragraphText,
	src,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(isOpen);
	}, [isOpen]);

	if (!isMounted) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-banner-layer px-4">
			<div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-btn-shadow w-full px-6 py-8 sm:w-[400px] md:w-[538px] md:pt-[54px] md:pr-[68px] md:pb-[91px] md:pl-[70px]">
				<div className="flex flex-col items-center justify-between gap-5 mb-2">
					<button onClick={onClose}>
						<Image src={src} alt="" width={100} height={100} />
					</button>
					<h2 className="heading black-text">{heading}</h2>
				</div>
				<p className="headline black-text sm:w-[268px] sm:mx-auto">
					{paragraphText}
				</p>
				<div className="mt-[30px] w-full">
					<ButtonPrimary type="button" onClick={onClose} label={buttonLabel} />
				</div>
			</div>
		</div>
	);
};

export default Modal;
