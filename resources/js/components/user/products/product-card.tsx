import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { Eye, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
    const handleAddToCart = (e) => {
        e.preventDefault(); // Cegah link terklik
        router.post(
            '/cart/add',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Masuk keranjang!'),
            },
        );
    };

    return (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* 1. Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Link href={`/products/${product.slug}`}>
                    <img
                        src={
                            product.image
                                ? `/storage/${product.image}`
                                : '/images/placeholder.png'
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>

                {/* Badge Stok */}
                {product.stock <= 5 && (
                    <Badge
                        variant="destructive"
                        className="absolute top-3 left-3 text-[10px] uppercase"
                    >
                        Sisa {product.stock}
                    </Badge>
                )}

                {/* Badge Kategori */}
                <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 bg-white/90 text-gray-700 backdrop-blur hover:bg-white"
                >
                    {product.category?.name}
                </Badge>
            </div>

            {/* 2. Info Section */}
            <div className="flex flex-1 flex-col p-5">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="line-clamp-1 font-display text-lg font-bold text-gray-900 transition-colors hover:text-primary">
                        {product.name}
                    </h3>
                </Link>

                {/* Deskripsi Singkat (Truncate) */}
                <p className="mt-2 line-clamp-2 h-10 text-sm leading-relaxed text-gray-500">
                    {product.description ||
                        'Tidak ada deskripsi untuk produk ini.'}
                </p>

                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Harga</p>
                        <p className="text-xl font-extrabold text-primary">
                            {formatRupiah(product.price)}
                        </p>
                    </div>
                    <span className="mb-1 text-xs text-gray-400">/ pack</span>
                </div>
            </div>

            {/* 3. Action Buttons (Bawah) */}
            <div className="grid grid-cols-4 gap-2 border-t border-gray-100 p-4">
                {/* Tombol Detail (Mata) */}
                <Link href={`/products/${product.slug}`} className="col-span-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-full border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
                    >
                        <Eye className="h-5 w-5" />
                    </Button>
                </Link>

                {/* Tombol Keranjang */}
                <Button
                    onClick={handleAddToCart}
                    className="col-span-3 bg-primary text-white shadow-md hover:bg-primary/90"
                >
                    <ShoppingCart className="mr-2 h-4 w-4" /> + Keranjang
                </Button>
            </div>
        </div>
    );
}
