import { NextRequest, NextResponse } from "next/server";

import admin from "@/lib/firebaseAdmin";
import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await connectToDB();

    const collection = await Collection.findById(params.collectionId).populate({ path: "products", model: Product });

    console.log("Fetched collection:", collection);

    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.error("[collectionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
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

    // Find the existing collection by ID
    const collection = await Collection.findById(params.collectionId);
    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    // Parse the request body
    const { title, description, image } = await req.json();

    // Validate input
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    // Update the collection
    collection.title = title;
    collection.description = description;
    collection.image = image;

    await collection.save(); // Save the updated collection

    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.error("[collectionId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// export const POST = async (
//   req: NextRequest,
//   { params }: { params: { collectionId: string } }
// ) => {
//   try {
//      // Get the Authorization header
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader) {
//       return new NextResponse("Unauthorized", { status: 403 });
//     }

//      // Extract the token from the header
//     const token = authHeader.split(' ')[1];

//      // Verify the token and get the user's UID
//     const decodedToken = await admin.auth().verifyIdToken(token);
//      const userId = decodedToken.uid; // This is your user's UID

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     await connectToDB();

//     let collection = await Collection.findById(params.collectionId);

//     if (!collection) {
//       return new NextResponse("Collection not found", { status: 404 });
//     }

//     const { title, description, image } = await req.json();

//     if (!title || !image) {
//       return new NextResponse("Title and image are required", { status: 400 });
//     }

//     collection = await Collection.findByIdAndUpdate(
//       params.collectionId,
//       { title, description, image },
//       { new: true }
//     );

//     await collection.save();

//     return NextResponse.json(collection, { status: 200 });
//   } catch (err) {
//     console.log("[collectionId_POST]", err);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// };

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
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

    await Collection.findByIdAndDelete(params.collectionId);

    // remove the collection id from the product
    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } }
    );
    
    return new NextResponse("Collection is deleted", { status: 200 });
  } catch (err) {
    console.log("[collectionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";