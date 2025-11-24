import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // adjust your prisma import

// GET /api/admin/users?role=USER&page=1&limit=10
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const role = searchParams.get('role') as 'USER' | 'ADMIN' | null;

  const where: any = {};
  if (role) where.role = role;

  const users = await db.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      wishlist: true,
      orders: true,
      payments: true
    }
  });

  const total = await db.user.count({ where });

  return NextResponse.json({ users, total, page, limit });
}

// PATCH /api/admin/users/:id
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id } = body; // expect { id, data: { name, role, email, etc } }

  if (!id || !body.data) {
    return NextResponse.json({ error: 'Missing id or data' }, { status: 400 });
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: body.data
  });

  return NextResponse.json({ user: updatedUser });
}

// DELETE /api/admin/users/:id
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await db.user.delete({ where: { id } });

  return NextResponse.json({ message: 'User deleted' });
}
