import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import admin from "@/lib/firebaseAdmin";

export const POST = async (req: NextRequest) => {
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
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Connect to the database
    await connectToDB();

    // Parse request body
    const { title, description, image } = await req.json();

    // Validate input
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    // Check for existing collection
    const existingCollection = await Collection.findOne({ title });
    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 });
    }

    // Create new collection
    const newCollection = new Collection({ title, description, image });
    await newCollection.save();

    return NextResponse.json(newCollection, { status: 201 }); // Use 201 for created resource
  } catch (err) {
    console.error("[collections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const collections = await Collection.find().sort({ createdAt: "desc" });
    return NextResponse.json(collections, { status: 200 });
  } catch (err) {
    console.error("[collections_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";