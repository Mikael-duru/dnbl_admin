"use client";

import { useEffect, useState } from "react";

function AlertCard({ alert }: any) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		// Timer to automatically dismiss the alert after 5 seconds
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 5000); // 5000 milliseconds = 5 seconds

		// Cleanup function to clear the timer if the component unmounts
		return () => clearTimeout(timer);
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
	};

	if (!isVisible) return null; // Don't render if not visible

	return (
		<div
			role="alert"
			className="rounded-xl border border-gray-100 bg-white p-4"
		>
			<div className="flex items-start gap-4">
				<span className="text-green-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</span>

				<div className="flex-1">
					<strong className="block font-medium text-gray-900">
						Email submitted successfully!
					</strong>

					<p className="mt-1 text-sm text-gray-700">{alert}</p>
				</div>

				<button
					className="text-gray-500 transition hover:text-gray-600"
					onClick={handleDismiss} // Dismiss on button click
				>
					<span className="sr-only">Dismiss popup</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}

export default AlertCard;
