import { NextRequest, NextResponse } from "next/server";

import admin from "@/lib/firebaseAdmin";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";

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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Parse the request body
    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      material,
      price,
      oldPrice,
      quantity,
      expense,
    } = await req.json();

    // Validate required fields
    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    // Create the new product
    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      material,
      price,
      oldPrice,
      quantity,
      expense,
    });

    await newProduct.save();

    console.log("new products:", newProduct._id)
    console.log("collection products:", newProduct.collections)

    // Update associated collections
    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.error("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, { status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      }, });
  } catch (err) {
    console.error("[products_GET]", err);
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
