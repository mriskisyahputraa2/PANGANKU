import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    CreditCard,
    PackageCheck,
    ShieldCheck,
    ShoppingCart,
    Snowflake,
    Truck,
} from 'lucide-react';
import { toast } from 'sonner';

const defaultProductImage = '/images/placeholder/default-product.png';

export default function Show({ product }: { product: any }) {
    function handleAddToCart(productId: number) {
        router.post(
            '/cart/add',
            { product_id: productId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // [FIX 2] Pesan Toast Lebih Sederhana & Bersih
                    toast.success(`${product.name} berhasil ditambahkan!`, {});
                    // Reload props 'cartCount' di header secara otomatis
                    router.reload({ only: ['cartCount'] });
                },
                onError: () => {
                    toast.error('Gagal menambahkan produk. Cek stok.');
                },
            },
        );
    }

    function handleCheckoutNow(productId: number) {
        router.get(
            '/checkout',
            { product_id: productId },
            {
                onError: () => toast.error('Gagal memproses checkout.'),
            },
        );
    }

    return (
        <PublicLayout transparentHeader={true}>
            <Head title={`${product.name} - PanganKU`} />

            <section className="min-h-screen bg-gray-50 py-12 pt-32 lg:pt-40">
                <div className="container mx-auto max-w-6xl px-6">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
                        {/* --- KOLOM KIRI: GAMBAR PRODUK --- */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="sticky top-28"
                        >
                            <div className="group relative flex aspect-square cursor-zoom-in items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                {/* [FIX 1] Gunakan 'object-contain' agar gambar utuh tidak terpotong */}
                                <img
                                    src={
                                        product.image
                                            ? `/storage/${product.image}`
                                            : defaultProductImage
                                    }
                                    alt={product.name}
                                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) =>
                                        (e.currentTarget.src =
                                            defaultProductImage)
                                    }
                                />

                                {product.stock <= 5 && (
                                    <div className="absolute top-4 left-4 animate-pulse rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                                        Sisa {product.stock} Pack!
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-4">
                                <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                                    <ShieldCheck className="mx-auto mb-2 h-6 w-6 text-green-600" />
                                    <p className="text-xs font-bold text-gray-700">
                                        100% Halal
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                                    <Snowflake className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                                    <p className="text-xs font-bold text-gray-700">
                                        Segar Dingin
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                                    <Truck className="mx-auto mb-2 h-6 w-6 text-orange-500" />
                                    <p className="text-xs font-bold text-gray-700">
                                        Kirim Cepat
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* --- KOLOM KANAN: DETAIL INFORMASI --- */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="mb-4">
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
                                    {product.category?.name || 'Umum'}
                                </span>
                            </div>

                            <h1 className="mb-4 font-display text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
                                {product.name}
                            </h1>

                            <div className="mb-8 flex items-baseline gap-2 border-b border-gray-200 pb-8">
                                <span className="text-4xl font-extrabold text-gray-900">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    }).format(Number(product.price))}
                                </span>
                                <span className="text-lg font-medium text-gray-500">
                                    / pack
                                </span>
                            </div>

                            {product.production_time && (
                                <div className="mb-8 flex items-start gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-green-800">
                                            Jaminan Segar (Fresh Cut)
                                        </h4>
                                        <p className="mt-1 text-sm text-green-700">
                                            Produk ini diproses pada:{' '}
                                            <strong>
                                                {product.production_time}
                                            </strong>
                                            . Dijamin masih segar saat sampai di
                                            tangan Anda.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="mb-3 text-lg font-bold text-gray-900">
                                    Deskripsi Produk
                                </h3>
                                <p className="text-base leading-relaxed text-gray-600">
                                    {product.description ||
                                        'Produk ayam segar berkualitas tinggi, dipotong dengan standar kebersihan ketat. Cocok untuk berbagai masakan rumah maupun usaha kuliner.'}
                                </p>
                            </div>

                            <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h4 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                                    <PackageCheck className="h-5 w-5 text-gray-500" />{' '}
                                    Spesifikasi Kemasan
                                </h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                                        <span>Berat Bersih</span>
                                        <span className="font-bold text-gray-900">
                                            Sesuai Varian
                                        </span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                                        <span>Kondisi Penyimpanan</span>
                                        <span className="font-bold text-gray-900">
                                            Chilled (0-4°C)
                                        </span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                                        <span>Kemasan Luar</span>
                                        <span className="font-bold text-gray-900">
                                            Plastik Food Grade
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="sticky bottom-0 z-20 -mx-4 flex flex-col gap-4 border-t border-gray-200 bg-white/80 p-4 backdrop-blur-md sm:static sm:mx-0 sm:flex-row sm:border-0 sm:bg-transparent sm:p-0">
                                <Button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="h-14 flex-1 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
                                    size="lg"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />+
                                    Keranjang
                                </Button>

                                <Button
                                    onClick={() =>
                                        handleCheckoutNow(product.id)
                                    }
                                    variant="secondary"
                                    className="h-14 flex-1 rounded-xl border border-gray-200 bg-white text-base font-bold hover:bg-gray-50"
                                    size="lg"
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Beli Langsung
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
