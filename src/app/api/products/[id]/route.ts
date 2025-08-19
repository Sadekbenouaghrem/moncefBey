// app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';  // Adjust the path as needed

// PUT - Update product by id
export async function PUT(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;  // Extract the ID from the params object

  try {
    const body = await request.json();
    const { name, price } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Error updating product" }, { status: 500 });
  }
}

// DELETE - Delete product by id
export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;  // Extract the ID from the params object

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 });
  }
}
