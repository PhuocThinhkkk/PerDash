import { NextRequest, NextResponse } from 'next/server';
import {
  createProductWithSkusTyped,
  updateProductWithSkus
} from '@/services/product';
import { requireAdmin } from '@/validations/admin';
import { handleError } from '@/lib/api-error-handler';
import { parseProductForm } from '../[productId]/parse-product-form';

// POST /api/admin/products/:id
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await requireAdmin();

    const id = parseInt((await params).productId);
    if (!id || isNaN(id) || id <= 0)
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    const formData = await req.formData();

    console.log('form: ', formData);

    const dataRaw = parseProductForm(formData);
    if (!dataRaw) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }
    console.log(dataRaw);

    const { name, description, categoryId, skus } = dataRaw;
    const data = {
      product: {
        name,
        description,
        categoryId
      },
      skus
    };
    await createProductWithSkusTyped(data);
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}
