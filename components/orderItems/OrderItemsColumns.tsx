"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderItemType>[] = [
	{
		accessorKey: "product",
		header: () => <h2>Product</h2>,
		cell: ({ row }) => {
			return (
				<Link
					href={`/products/${row.original.product._id}`}
					className="hover:underline hover:text-[#B47B2B] dark:hover:text-[#B47B2B]"
				>
					{row.original.product.title}
				</Link>
			);
		},
	},
	{
		accessorKey: "color",
		header: () => <h2 className="text-center">Color</h2>,
		cell: ({ row }) => {
			return <p className="text-center">{row.original.color}</p>;
		},
	},
	{
		accessorKey: "size",
		header: () => <h2 className="text-center">Size</h2>,
		cell: ({ row }) => {
			return <p className="text-center">{row.original.size}</p>;
		},
	},
	{
		accessorKey: "quantity",
		header: () => <h2 className="text-center">Quantity</h2>,
		cell: ({ row }) => {
			return <p className="text-center">{row.original.quantity}</p>;
		},
	},
];
