import { DataTable } from "@/components/custom-ui/DataTable";
import { columns } from "@/components/customers/CustomerColumns";
import { Separator } from "@/components/ui/separator";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";

const Customers = async () => {
	await connectToDB();

	const customers = await Customer.find().sort({ createdAt: "desc" });

	// Convert Mongoose documents to plain JavaScript objects
	const plainCustomers = customers.map((customer) => {
		const plainCustomer = customer.toObject();
		// Convert MongoDB ObjectId to string
		plainCustomer._id = plainCustomer._id.toString();
		// Convert Date objects to ISO strings
		plainCustomer.createdAt = plainCustomer.createdAt.toISOString();
		plainCustomer.updatedAt = plainCustomer.updatedAt.toISOString();
		return plainCustomer;
	});

	return (
		<section className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
				Customers
			</h2>
			<Separator className="bg-grey-1 my-5" />
			<DataTable columns={columns} data={plainCustomers} searchKey="name" />
		</section>
	);
};

export const dynamic = "force-dynamic";

export default Customers;
