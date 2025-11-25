import ProductForm from '@/components/admin/products/product-form';

export default function Edit({ categories, product }) {
    return <ProductForm categories={categories} product={product} />;
}
