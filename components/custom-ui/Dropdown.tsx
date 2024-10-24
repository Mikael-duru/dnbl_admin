import React, { useState } from "react";
import toast from "react-hot-toast";

import { auth } from "@/firebase/firebase";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

interface CustomDropdownProps {
	orderId: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ orderId }) => {
	const [selectedOption, setSelectedOption] = useState("default");
	const user = auth.currentUser;
	const [loading, setLoading] = useState(false);

	const statusMapping: { [key: string]: string } = {
		shipped: "Shipped",
		delivered: "Delivered",
		cancelled: "Cancelled",
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (selectedOption === "default") {
			toast.error("Please select a valid status.");
			return;
		}

		const normalizedStatus = statusMapping[selectedOption];

		if (user) {
			const idToken = await user.getIdToken();
			console.log("Status User ID Token:", idToken);

			try {
				setLoading(true);
				const response = await fetch(
					`http://localhost:3000/api/orders/${orderId}/status`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${idToken}`,
						},
						body: JSON.stringify({ status: normalizedStatus }),
					}
				);

				if (!response.ok) {
					throw new Error("Failed to update status");
				}

				setLoading(false);

				window.location.href = "/orders";
				const result = await response.json();
				toast.success(`${result.message}`);
			} catch (error) {
				console.error("Error updating status:", error);
				toast.error("Error updating status.");
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex items-center justify-center space-x-4"
		>
			<Select onValueChange={(value) => setSelectedOption(value)}>
				<SelectTrigger className="w-full px-2 py-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer">
					<SelectValue placeholder="Update Status" className="text-xs" />
				</SelectTrigger>
				<SelectContent className="text-xs">
					<SelectItem value="default">Update Status</SelectItem>
					<SelectItem value="shipped">Shipped</SelectItem>
					<SelectItem value="delivered">Delivered</SelectItem>
					<SelectItem value="cancelled">Cancelled</SelectItem>
				</SelectContent>
			</Select>
			<button
				type="submit"
				className="bg-green-500 text-white rounded-lg hover:bg-green-600 p-2"
			>
				<Check className="h-5 w-5" />
			</button>
		</form>
	);
};

export default CustomDropdown;
