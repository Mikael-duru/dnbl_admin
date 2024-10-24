"use client";

import Link from "next/link";

import Delete from "../custom-ui/Delete";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ProductType>[] = [
	{
		accessorKey: "title",
		header: () => <h2>Title</h2>,
		cell: ({ row }) => (
			<Link
				href={`/products/${row?.original?._id}`}
				className="hover:underline hover:text-[#B47B2B] dark:hover:text-[#B47B2B]"
			>
				{row.original.title}
			</Link>
		),
	},
	{
		accessorKey: "category",
		header: () => <h2 className="text-center">Category</h2>,
		cell: ({ row }) => {
			return <p className="text-center">{row.original.category}</p>;
		},
	},
	{
		accessorKey: "collections",
		header: () => <h2 className="text-center">Collections</h2>,
		cell: ({ row }) => (
			<p className="text-center">
				{row.original.collections
					.map((collection) => collection.title)
					.join(", ")}
			</p>
		),
	},
	{
		accessorKey: "price",
		header: () => <h2 className="text-center">Price (₦)</h2>,
		cell: ({ row }) => {
			return <p className="text-center">{row.original.price}</p>;
		},
	},
	{
		accessorKey: "expense",
		header: () => <h2 className="text-center">Expense (₦)</h2>,
		cell: ({ row }) => {
			return <p className="text-center">{row.original.expense}</p>;
		},
	},
	{
		id: "actions",
		header: () => <h2 className="text-center">Actions</h2>,
		cell: ({ row }) => (
			<div className="text-center">
				<Delete item="product" id={row.original._id} />
			</div>
		),
	},
];
