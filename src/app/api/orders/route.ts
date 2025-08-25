import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the path according to your setup

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId, status, totalAmount, address, phone, items, fullName } = body;

    // Ensure that all required fields are present
    if (!status || !totalAmount || !address || !phone || !items?.length || !fullName) {
      return NextResponse.json(
        { error: "Données manquantes dans la requête." },
        { status: 400 }
      );
    }

    // If userId is null, use "guest" or leave it as null if desired
    const finalUserId = userId || null; // "guest" can be an option, or null for guest users

    // Create the order along with its items
    const order = await prisma.order.create({
      data: {
        userId: finalUserId,
        status: status || "PENDING", // Default to "PENDING" if no status is provided
        totalAmount,
        address,
        phone,
        fullName,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true, // Include related items in the response
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création de la commande." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetch orders, order items, and associated user data
    const orders = await prisma.order.findMany({
      include: {
        items: { 
          include: {
            product: true, // Include product details for each order item
          }
        },
        user: true, // Include user details
      },
      orderBy: {
        createdAt: 'desc', // Sort by most recent order first
      },
    });

    // Return orders as a response
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}