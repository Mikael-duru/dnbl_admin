"use client";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<CustomerType>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "firebaseId",
		header: "User ID",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
];
