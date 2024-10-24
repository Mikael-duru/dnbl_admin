"use client";

import { ColumnDef } from "@tanstack/react-table";
import Dropdown from "../custom-ui/Dropdown";
import Link from "next/link";

export const columns: ColumnDef<OrderColumnType>[] = [
	{
		accessorKey: "_id",
		header: () => <h2>Order Id</h2>,
		cell: ({ row }) => (
			<Link
				href={`/orders/${row.getValue("_id")}`}
				className="hover:underline hover:text-[#B47B2B] dark:hover:text-[#B47B2B]"
			>
				{row.getValue("_id")}
			</Link>
		),
	},
	{
		accessorKey: "customer",
		header: () => <h2 className="text-center">Customer</h2>,
		cell: ({ row }) => (
			<p className="text-center">{row.getValue("customer")}</p>
		),
	},
	{
		accessorKey: "products",
		header: () => <h2 className="text-center">Products</h2>,
		cell: ({ row }) => (
			<p className="text-center">{row.getValue("products")}</p>
		),
	},
	{
		accessorKey: "totalAmount",
		header: () => <h2 className="text-center">Total (₦)</h2>,
		cell: ({ row }) => (
			<p className="text-center">{row.getValue("totalAmount")}</p>
		),
	},
	{
		accessorKey: "createdAt",
		header: () => <h2 className="text-center">Created</h2>,
		cell: ({ row }) => (
			<p className="text-center">{row.getValue("createdAt")}</p>
		),
	},
	{
		accessorKey: "status",
		header: () => <h2 className="text-center">Status</h2>,
		cell: ({ row }) => (
			<p className={`text-center ${getStatusClass(row.getValue("status"))}`}>
				{row.getValue("status")}
			</p>
		),
	},
	{
		id: "actions",
		header: () => <h2 className="text-center">Actions</h2>,
		cell: ({ row }) => (
			<div>
				<Dropdown orderId={row.getValue("_id")} />
			</div>
		),
	},
];

// Helper function to get status class based on status value
const getStatusClass = (status: string) => {
	switch (status) {
		case "Cancelled":
			return "text-red-1";
		case "Delivered":
			return "text-green-600";
		case "Shipped":
			return "text-[#B47B2B]";
		default:
			return "text-grey-1 dark:text-white-1";
	}
};
