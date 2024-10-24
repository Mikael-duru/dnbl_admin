import {
	TbCurrencyNaira,
	TbShoppingBagCheck,
	TbUsersGroup,
} from "react-icons/tb";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	getSalesPerMonth,
	getTotalCustomers,
	getTotalSales,
} from "@/lib/actions/actions";
import SalesChart from "@/components/custom-ui/SalesChart";

export default async function Home() {
	const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
	const salesRawDifference = await getTotalSales().then(
		(data) => data.salesRawDifference
	);
	const salesPercentageDifference = await getTotalSales().then(
		(data) => data.salesPercentageDifference
	);
	const totalOrders = await getTotalSales().then((data) => data.totalOrders);
	const ordersRawDifference = await getTotalSales().then(
		(data) => data.ordersRawDifference
	);
	const ordersPercentageDifference = await getTotalSales().then(
		(data) => data.ordersPercentageDifference
	);
	const totalCustomers = await getTotalCustomers().then(
		(data) => data.totalCustomers
	);
	const customerRawDifference = await getTotalCustomers().then(
		(data) => data.customerRawDifference
	);
	const customerPercentageDifference = await getTotalCustomers().then(
		(data) => data.customerPercentageDifference
	);

	const graphData = await getSalesPerMonth();

	return (
		<section className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
				Dashboard
			</h2>
			<Separator className="bg-grey-1 my-5" />

			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-5">
				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle>Total Revenue</CardTitle>
						<div className="flex items-center justify-center py-1 px-[2px] rounded-md w-[36px] h-[36px] bg-[#36DA78]">
							<TbCurrencyNaira size={24} className="text-[#82F8B1]" />
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-body-bold text-[#3B4758] dark:text-[#B47B2B]">
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "NGN",
							}).format(totalRevenue)}
						</p>
						<p className="font-inter text-xs text-[#586A84] dark:text-gray-400 pt-[10px]">
							<span
								className={`${
									salesRawDifference > 0 ? "text-green-600" : "text-red-600"
								}`}
							>
								{salesPercentageDifference}
							</span>{" "}
							since last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle>Total Orders</CardTitle>
						<div className="flex items-center justify-center py-1 px-[2px] rounded-md w-[36px] h-[36px] bg-[#489DEC]">
							<TbShoppingBagCheck size={24} className="text-[#B0D9FF]" />
						</div>
					</CardHeader>
					<CardContent>
						<h2 className="text-body-bold text-[#3B4758] dark:text-[#B47B2B]">
							{totalOrders}
						</h2>
						<p className="font-inter text-xs text-[#586A84] dark:text-gray-400 pt-[10px]">
							<span
								className={`${
									ordersRawDifference > 0 ? "text-green-600" : "text-red-600"
								}`}
							>
								{ordersPercentageDifference}
							</span>{" "}
							since last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle>Total Customers</CardTitle>
						<div className="flex items-center justify-center py-1 px-[2px] rounded-md w-[36px] h-[36px] bg-[#FF59EE]">
							<TbUsersGroup size={24} className="text-[#FFB6F7]" />
						</div>
					</CardHeader>
					<CardContent>
						<h2 className="text-body-bold text-[#3B4758] dark:text-[#B47B2B]">
							{totalCustomers}
						</h2>
						<p className="font-inter text-xs text-[#586A84] dark:text-gray-400 pt-[10px]">
							<span
								className={`${
									customerRawDifference > 0 ? "text-green-600" : "text-red-600"
								}`}
							>
								{customerPercentageDifference}
							</span>{" "}
							since last month
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="mt-10">
				<Card>
					<CardHeader>
						<CardTitle>Sales Chart (₦)</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesChart data={graphData} />
					</CardContent>
				</Card>
			</div>
		</section>
	);
}

export const dynamic = "force-dynamic";
