"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Separator } from "../ui/separator";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/custom-ui/imageUpload";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { auth } from "@/firebase/firebase";
import Delete from "../custom-ui/Delete";

const formSchema = z.object({
	title: z.string().min(2).max(20),
	description: z.string().min(2).max(500),
	image: z.string(),
});

interface CollectionFormProps {
	initialData?: CollectionType | null;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
	const router = useRouter();
	const user = auth.currentUser;

	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? initialData
			: {
					title: "",
					description: "",
					image: "",
			  },
	});

	const handleKeyPress = (
		e:
			| React.KeyboardEvent<HTMLInputElement>
			| React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (user) {
			const idToken = await user.getIdToken();
			console.log("User ID Token:", idToken);

			try {
				setLoading(true);
				const url = initialData
					? `/api/collections/${initialData._id}`
					: "/api/collections";
				const res = await fetch(url, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${idToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				});

				if (!res.ok) {
					const errorText = await res.text();
					console.error("Server Error:", errorText);
					throw new Error(errorText);
				}

				// const newCollection = await res.json();
				setLoading(false);
				toast.success(`Collection ${initialData ? "updated" : "created"}`);
				window.location.href = "/collections";
				router.push("/collections");
			} catch (err) {
				console.error("[collections_POST]", err);
				toast.error("Something went wrong! Please try again.");
				setLoading(false);
			}
		}
	};

	return (
		<section className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10 min-h-screen">
			{initialData ? (
				<div className="flex items-center justify-between">
					<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
						Edit Collection
					</h2>
					<Delete item="collection" id={initialData._id} />
				</div>
			) : (
				<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
					Create Collection
				</h2>
			)}
			<Separator className="mt-4 mb-7" />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{/* title */}
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="label-heading">Title</FormLabel>
								<FormControl>
									<Input
										placeholder="Title"
										{...field}
										onKeyDown={handleKeyPress}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* description */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="label-heading">Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Description"
										{...field}
										rows={5}
										onKeyDown={handleKeyPress}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Image */}
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="label-heading">Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex items-center max-sm:justify-center gap-10">
						<Button
							type="submit"
							className="font-inter font-semibold text-white bg-btn-gold hover:rounded-full ease-in-out duration-300 py-6 px-[37px]"
						>
							Submit
						</Button>
						<Button
							type="button"
							className="font-inter font-semibold text-white bg-btn-gold hover:rounded-full ease-in-out duration-300 py-6 px-[37px]"
							onClick={() => router.push("/collections")}
						>
							Discard
						</Button>
					</div>
				</form>
			</Form>
		</section>
	);
};

export default CollectionForm;
