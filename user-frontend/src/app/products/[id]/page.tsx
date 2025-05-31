import ProductDetail from '@/components/products/ProductDetail';

type paramsType = Promise<{ id: string; }>;

// Make the component async
export default async function ProductDetailPage(props: { params: paramsType}) {
    const { id } = await props.params;
    return <ProductDetail id={id} />;
}