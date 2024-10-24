"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom-ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<CollectionType>[] = [
	{
		accessorKey: "title",
		id: "title",
		header: "Collections",
		cell: ({ row }) => (
			<Link
				href={`/collections/${row.original._id}`}
				className="hover:underline hover:text-[#B47B2B] dark:hover:text-[#B47B2B]"
			>
				{row.original.title}
			</Link>
		),
	},
	{
		accessorKey: "products",
		header: () => <h2 className="text-center">Products</h2>,
		cell: ({ row }) => (
			<p className="text-center">{row.original.products.length}</p>
		),
	},
	{
		id: "actions",
		header: () => <h2 className="text-center">Actions</h2>,
		cell: ({ row }) => (
			<div className="text-center">
				<Delete item="collection" id={row.original._id} />
			</div>
		),
	},
];
