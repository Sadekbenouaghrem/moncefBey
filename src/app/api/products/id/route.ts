// app/api/products/id/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path as needed

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price } = body;

    console.log("PUT request data:", body);  // Log the request body for debugging

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);  // Log the error
    return NextResponse.json({ error: "Error updating product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    console.log("DELETE request data:", body);  // Log the request body for debugging

    // Ensure that the id exists and is valid
    if (!id) {
      console.error("No product ID provided.");
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Delete related ProductImage entries
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    // Delete related OrderItem entries (you may need to handle them differently depending on your business logic)
    await prisma.orderItem.deleteMany({
      where: { productId: id },
    });

    // Delete related Review entries
    await prisma.review.deleteMany({
      where: { productId: id },
    });

    // Delete the product itself
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    console.log("Product deleted:", deletedProduct);  // Log the deleted product for verification

    return NextResponse.json({ message: "Product and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);  // Log the error
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 });
  }
}