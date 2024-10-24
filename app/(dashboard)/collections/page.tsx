"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom-ui/DataTable";
import { columns } from "@/components/collections/CollectionColumns";

const Collections = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState([]);

	const getCollections = async () => {
		try {
			const res = await fetch("/api/collections", {
				method: "GET",
			});
			const data = await res.json();
			setCollections(data);
			setLoading(false);
		} catch (err) {
			console.log("[collections_GET]", err);
		}
	};

	useEffect(() => {
		getCollections();
	}, []);

	console.log("collections details", collections);

	if (!collections) {
		return null;
	}

	return (
		<section className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			<div className="flex items-center justify-between">
				<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
					Collections
				</h2>
				<Button
					type="button"
					className="font-inter text-body-medium font-semibold text-white bg-[#3E3E3E] hover:scale-95 duration-300 md:py-6 md:px-[30px]"
					onClick={() => router.push("/collections/new")}
				>
					<Plus className="h-4 w-4 md:mr-2" />
					<span className="hidden md:inline">Create collection</span>
				</Button>
			</div>
			<Separator className="mt-4 mb-7" />
			<DataTable columns={columns} data={collections} searchKey="title" />
		</section>
	);
};

export const dynamic = "force-dynamic";

export default Collections;
