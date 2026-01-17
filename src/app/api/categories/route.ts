import { getAllCategories } from '@/services/categories';
import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/lib/api-error-handler';

export async function GET(req: NextRequest) {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}
