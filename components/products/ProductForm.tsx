"use client";

import React, { useState, useEffect } from "react";
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
	FormDescription,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "../custom-ui/imageUpload";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { auth } from "@/firebase/firebase";
import Delete from "../custom-ui/Delete";
import MultiText from "../custom-ui/MultiText";
import MultiSelect from "../custom-ui/MultiSelect";
import Loader from "../custom-ui/Loader";

const formSchema = z.object({
	title: z.string().min(2).max(20),
	description: z.string().min(2).max(500).trim(),
	media: z.array(z.string()),
	category: z.string(),
	collections: z.array(z.string()),
	tags: z.array(z.string()),
	colors: z.array(z.string()),
	sizes: z.array(z.string()),
	material: z.string(),
	price: z.coerce.number().min(0.1),
	oldPrice: z.coerce.number().min(0.1),
	expense: z.coerce.number().min(0.1),
	quantity: z.coerce.number().min(1),
});

interface ProductFormProps {
	initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
	const router = useRouter();
	const user = auth.currentUser;

	const [loading, setLoading] = useState(false);
	const [collections, setCollections] = useState<CollectionType[]>([]);

	const getCollections = async () => {
		try {
			const res = await fetch("/api/collections", {
				method: "GET",
			});
			const data = await res.json();
			// console.log(data);
			if (data) {
				setCollections(data);
				setLoading(false);
			}
		} catch (err) {
			console.log("[collections_GET]", err);
			toast.error("Something went wrong! Please try again.");
		}
	};

	useEffect(() => {
		getCollections();
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					...initialData,
					collections: initialData.collections.map(
						(collection) => collection._id
					),
			  }
			: {
					title: "",
					description: "",
					media: [],
					category: "",
					collections: [],
					tags: [],
					sizes: [],
					colors: [],
					material: "",
					price: 0.1,
					oldPrice: 0.1,
					expense: 0.1,
					quantity: 1,
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

			try {
				setLoading(true);
				const url = initialData
					? `/api/products/${initialData._id}`
					: "/api/products";
				const res = await fetch(url, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${idToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values), // Ensure this matches the expected structure
				});

				if (!res.ok) {
					const errorText = await res.text(); // Get detailed error message
					console.error("Server Error:", errorText);
					throw new Error(errorText);
				}

				setLoading(false);
				toast.success(`Product ${initialData ? "updated" : "created"}`);
				window.location.href = "/products";
				router.push("/products");
			} catch (err) {
				console.error("[products_POST]", err);
				toast.error("Something went wrong! Please try again.");
				setLoading(false);
			}
		}
	};

	const handleBack = () => {
		if (router) {
			router.back();
		}
	};

	return loading ? (
		<Loader />
	) : (
		<section className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10 min-h-screen">
			{initialData ? (
				<div className="flex items-center justify-between">
					<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
						Edit Product
					</h2>
					<Delete item="product" id={initialData._id} />
				</div>
			) : (
				<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
					Create Product
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
								<FormMessage className="text-red-1" />
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
								<FormMessage className="text-red-1" />
							</FormItem>
						)}
					/>
					{/* Image */}
					<FormField
						control={form.control}
						name="media"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="label-heading">Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value}
										onChange={(url) => field.onChange([...field.value, url])}
										onRemove={(url) =>
											field.onChange([
												...field.value.filter((image) => image !== url),
											])
										}
									/>
								</FormControl>
								<FormMessage className="text-red-1" />
							</FormItem>
						)}
					/>

					{/* grid section */}
					<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
						{/* price */}
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Price (₦)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Actual price"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormDescription className="dark:text-gray-400">
										Selling price of the product
									</FormDescription>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* oldPrice */}
						<FormField
							control={form.control}
							name="oldPrice"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Old Price (₦)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Old price"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormDescription className="dark:text-gray-400">
										To showing discount.
									</FormDescription>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* expense */}
						<FormField
							control={form.control}
							name="expense"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Expense (₦)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Expense"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormDescription className="dark:text-gray-400">
										Cost of production.
									</FormDescription>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* quantity */}
						<FormField
							control={form.control}
							name="quantity"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Quantity</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Quantity"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* category */}
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Category</FormLabel>
									<FormControl>
										<Input
											placeholder="Category"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* material */}
						<FormField
							control={form.control}
							name="material"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Material</FormLabel>
									<FormControl>
										<Input
											placeholder="Material"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* tags */}
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Tags</FormLabel>
									<FormControl>
										<MultiText
											placeholder="Tags (e.g. Top, Shorts)"
											value={field.value}
											onChange={(tag) => field.onChange([...field.value, tag])}
											onRemove={(tagToRemove) =>
												field.onChange([
													...field.value.filter((tag) => tag !== tagToRemove),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* sizes */}
						<FormField
							control={form.control}
							name="sizes"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Sizes</FormLabel>
									<FormControl>
										<MultiText
											placeholder="Sizes (e.g. S, M)"
											value={field.value}
											onChange={(size) =>
												field.onChange([...field.value, size])
											}
											onRemove={(sizeToRemove) =>
												field.onChange([
													...field.value.filter(
														(size) => size !== sizeToRemove
													),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* colors */}
						<FormField
							control={form.control}
							name="colors"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="label-heading">Colors</FormLabel>
									<FormControl>
										<MultiText
											placeholder="Colors"
											value={field.value}
											onChange={(color) =>
												field.onChange([...field.value, color])
											}
											onRemove={(colorToRemove) =>
												field.onChange([
													...field.value.filter(
														(color) => color !== colorToRemove
													),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>

						{/* collections */}
						{collections.length > 0 && (
							<FormField
								control={form.control}
								name="collections"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="label-heading">Collections</FormLabel>
										<FormControl>
											<MultiSelect
												placeholder="Collections"
												collections={collections}
												value={field.value}
												onChange={(_id) =>
													field.onChange([...field.value, _id])
												}
												onRemove={(idToRemove) =>
													field.onChange([
														...field.value.filter(
															(collectionId) => collectionId !== idToRemove
														),
													])
												}
											/>
										</FormControl>
										<FormMessage className="text-red-1" />
									</FormItem>
								)}
							/>
						)}
					</div>

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
							onClick={handleBack}
						>
							Discard
						</Button>
					</div>
				</form>
			</Form>
		</section>
	);
};

export default ProductForm;
