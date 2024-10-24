import { DataTable } from "@/components/custom-ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColumns";
import { Separator } from "@/components/ui/separator";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
	const res = await fetch(
		`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`
	);
	const { orderDetails, customer } = await res.json();

	const { street, city, state, postalCode, country } =
		orderDetails.shippingAddress;

	return (
		<div className="flex flex-col gap-5 py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			<>
				<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
					Order Details
				</h2>
				<Separator className="mt-4 mb-3" />
			</>
			<p className="text-base-bold dark:text-white-1">
				Order ID: <span className="text-base-medium">{orderDetails._id}</span>
			</p>
			<p className="text-base-bold dark:text-white-1">
				Customer name: <span className="text-base-medium">{customer.name}</span>
			</p>
			<p className="text-base-bold dark:text-white-1">
				Shipping address:{" "}
				<span className="text-base-medium">
					{street}, {city}, {state}, {postalCode}, {country}
				</span>
			</p>
			<p className="text-base-bold dark:text-white-1">
				Total Paid:{" "}
				<span className="text-base-medium">
					{Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "NGN",
					}).format(orderDetails.totalAmount)}
				</span>
			</p>
			<p className="text-base-bold dark:text-white-1">
				Shipping rate ID:{" "}
				<span className="text-base-medium">{orderDetails.shippingRate}</span>
			</p>
			<p className="text-base-bold dark:text-white-1">
				Status:{" "}
				<span
					className={`text-base-medium ${
						orderDetails.status === "Cancelled"
							? "text-red-1"
							: orderDetails.status === "Delivered"
							? "text-green-600"
							: orderDetails.status === "Shipped"
							? "text-[#B47B2B]"
							: "text-grey-1 dark:text-white-1"
					}`}
				>
					{orderDetails.status}
				</span>
			</p>
			<DataTable
				columns={columns}
				data={orderDetails.products}
				searchKey="product"
			/>
		</div>
	);
};

export const dynamic = "force-dynamic";

export default OrderDetails;
