"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom-ui/Loader";
import { DataTable } from "@/components/custom-ui/DataTable";
import { columns } from "@/components/products/ProductColumns";

const Products = () => {
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState<ProductType[]>([]);

	const getProducts = async () => {
		try {
			const res = await fetch("/api/products", {
				method: "GET",
			});
			const data = await res.json();
			setProducts(data);
			setLoading(false);
		} catch (err) {
			console.log("[products_GET]", err);
		}
	};

	useEffect(() => {
		getProducts();
	}, []);

	return loading ? (
		<Loader />
	) : (
		<section className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			<div className="flex items-center justify-between">
				<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
					Products
				</h2>
				<Button
					type="button"
					className="font-inter text-body-medium font-semibold text-white bg-[#3E3E3E] hover:scale-95 duration-300 md:py-6 md:px-[30px]"
					onClick={() => router.push("/products/new")}
				>
					<Plus className="h-4 w-4 md:mr-2" />
					<span className="hidden md:inline">Create Products</span>
				</Button>
			</div>
			<Separator className="mt-4 mb-7" />
			<DataTable columns={columns} data={products} searchKey="title" />
		</section>
	);
};

export const dynamic = "force-dynamic";

export default Products;
