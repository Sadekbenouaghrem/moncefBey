import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import path to your prisma client

// GET - Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// PUT - Update the isAdmin property for a user
export async function PUT(req: Request) {
  try {
    const { userId, isAdmin } = await req.json();
    if (!userId || typeof isAdmin !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Update user isAdmin status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
