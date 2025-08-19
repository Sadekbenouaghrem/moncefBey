// app/api/products/route.ts

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PUT - Update product by id
export async function PUT(request: Request) {
  try {
    // Get the product data and id from the request body (example)
    const body = await request.json();
    const { id, name, description, price, quantity, categoryId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price,
        quantity,
        categoryId,

      },
    });

    return NextResponse.json(updatedProduct);  // Return the updated product
  } catch (error) {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

// DELETE - Delete product by id
export async function DELETE(request: Request) {
  try {
    // Extract ID from query params or the body, depending on the request
    const url = new URL(request.url);
    const id = url.searchParams.get('id'); // Get the ID from query parameter

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Delete the product with the provided id
    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });  // Confirm deletion
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
  }
}
