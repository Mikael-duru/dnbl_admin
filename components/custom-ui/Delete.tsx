import React, { useState } from "react";
import { Trash } from "lucide-react";

import { Button } from "../ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { auth } from "@/firebase/firebase";

interface DeleteProps {
	item: string;
	id: string;
}

const Delete: React.FC<DeleteProps> = ({ item, id }) => {
	const [loading, setLoading] = useState(false);
	const user = auth.currentUser;

	const onDelete = async () => {
		if (user) {
			const idToken = await user.getIdToken();

			try {
				setLoading(true);
				const itemType = item === "product" ? "products" : "collections";
				const res = await fetch(`/api/${itemType}/${id}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${idToken}`,
						"Content-Type": "application/json",
					},
				});

				if (res.ok) {
					setLoading(false);
					window.location.href = `${itemType}`;
					toast.success(`${item} deleted`);
				}
			} catch (error) {
				console.log(error);
				toast.error("Something went wrong. Please try again.");
			}
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<Button type="button" className="bg-red-1 text-white">
					<Trash className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-[#FDFDFD] dark:bg-[#1E1E1E] text-grey-1 dark:text-gray-300">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-red-1">
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the{" "}
						{item}.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default Delete;
