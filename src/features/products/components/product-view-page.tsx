import { fakeProducts, Product } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import { getProductWithSkusById } from '@/services/product';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    const data = await getProductWithSkusById(productId);
    product = data;
    if (!product) {
      notFound();
    }
    pageTitle = `Edit Product`;
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
