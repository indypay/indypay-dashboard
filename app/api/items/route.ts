import { NextResponse } from 'next/server';

// Mock data - replace with your actual database calls
let items = [
  {
    id: '1',
    name: 'Sample Item 1',
    description: 'Description for item 1',
    price: 100,
    tax: 18,
  },
  // Add more mock items as needed
];

export async function GET() {
  try {
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = {
      id: Date.now().toString(),
      ...body,
    };
    items.push(newItem);
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    items = items.filter((item) => item.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 },
    );
  }
}
