"use client";

import { DataTable } from "@/components/custom-ui/DataTable";
import Loader from "@/components/custom-ui/Loader";
import { columns } from "@/components/orders/OrderColumns";
import { Separator } from "@/components/ui/separator";

import { useEffect, useState } from "react";

const Orders = () => {
	// const res = await fetch("http://localhost:3000/api/orders", {
	// 	cache: "no-store", // Disable caching
	// });
	// const orders = await res.json();

	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState([]);

	const getOrders = async () => {
		try {
			const res = await fetch(`/api/orders`);
			const data = await res.json();
			setOrders(data);
			setLoading(false);
		} catch (err) {
			console.log("[orders_GET", err);
		}
	};

	useEffect(() => {
		getOrders();
	}, []);

	return loading ? (
		<Loader />
	) : (
		<section className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
				Orders
			</h2>
			<Separator className="bg-grey-1 my-5" />
			<DataTable columns={columns} data={orders} searchKey="_id" />
		</section>
	);
};

export const dynamic = "force-dynamic";

export default Orders;
