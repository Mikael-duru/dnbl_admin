import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/Order";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    // Verify the token and get the user's UID
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid; // This is your user's UID

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Find the order by ID
    const order = await Order.findById(params.orderId);
    if (!order) {
      return new NextResponse(
        JSON.stringify({ message: "Order not found" }),
        { status: 404 }
      );
    }

    // Parse the request body to get the new status
    const { status } = await req.json();

    // Validate the new status
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Check if the status change is valid
    if (status === 'Shipped' && order.status !== 'Processing') {
      return new NextResponse("Order must be in Processing status to be shipped.", { status: 400 });
    }
    if (status === 'Delivered' && order.status !== 'Shipped') {
      return new NextResponse("Order must be in Shipped status to be delivered.", { status: 400 });
    }
    if (status === 'Cancelled' && order.status === 'Delivered') {
      return new NextResponse("Order cannot be canceled after it has been delivered.", { status: 400 });
    }

    // Update the order status
    order.status = status;
    await order.save();

    return NextResponse.json({ message: "Order status updated successfully.", order }, { status: 200 });
  } catch (err) {
    console.error("[orderId_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";