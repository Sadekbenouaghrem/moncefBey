// app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';  // Adjust the path as needed

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { name, price } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
  }
}
