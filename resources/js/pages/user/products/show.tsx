import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    PackageCheck,
    ShoppingCart,
    Snowflake,
} from 'lucide-react';
import { useState } from 'react';

const defaultProductImage = '/images/placeholder/default-product.png';

export default function Show({ product }: { product: any }) {
    const [message, setMessage] = useState<string | null>(null);

    function handleAddToCart(productId: number) {
        router.post(
            '/cart/add',
            { product_id: productId },
            {
                onSuccess: () => {
                    setMessage('✅ Produk berhasil ditambahkan ke keranjang!');
                    setTimeout(() => setMessage(null), 3000);
                },
                onError: () => {
                    setMessage('❌ Gagal menambahkan produk ke keranjang.');
                    setTimeout(() => setMessage(null), 3000);
                },
            },
        );
    }

    function handleCheckoutNow(productId: number) {
        router.get(
            '/checkout',
            { product_id: productId },
            {
                onError: () => {
                    setMessage('❌ Gagal memproses checkout.');
                    setTimeout(() => setMessage(null), 3000);
                },
            },
        );
    }

    return (
        <PublicLayout>
            <Head title={`${product.name} - PanganKU`} />

            <section className="bg-background py-16 md:py-24">
                <div className="container mx-auto max-w-6xl px-6">
                    {/* Tombol Kembali */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <Link href="/products">
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 pl-0 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="h-5 w-5" /> Kembali ke
                                Katalog
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
                        {/* 🖼️ KOLOM KIRI: GAMBAR & INFO JAM POTONG */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="sticky top-28"
                        >
                            <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-lg">
                                <img
                                    src={
                                        product.image
                                            ? `/storage/${product.image}`
                                            : defaultProductImage
                                    }
                                    alt={product.name}
                                    className="aspect-square h-auto w-full rounded-xl object-cover"
                                    onError={(e) =>
                                        (e.currentTarget.src =
                                            defaultProductImage)
                                    }
                                />
                            </div>

                            {/* [BARU] Banner Jaminan Segar */}
                            {product.production_time && (
                                <div className="mt-6 flex items-center gap-4 rounded-xl border border-green-100 bg-green-50 p-4 shadow-sm">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                                        <Clock className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-green-800">
                                            Jaminan Segar (Fresh Cut)
                                        </h4>
                                        <p className="text-green-700">
                                            Diproses:{' '}
                                            <strong>
                                                {product.production_time}
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* 📦 KOLOM KANAN: DETAIL PRODUK */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="mb-4">
                                <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                                    {product.category?.name || 'Tanpa Kategori'}
                                </span>
                                <h1 className="text-3xl leading-tight font-extrabold text-foreground md:text-4xl">
                                    {product.name}
                                </h1>
                            </div>

                            <div className="mb-6 flex items-baseline gap-2">
                                <p className="text-3xl font-extrabold text-primary">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    }).format(Number(product.price))}
                                </p>
                                <span className="text-lg font-medium text-muted-foreground">
                                    / pack
                                </span>
                            </div>

                            {/* [BARU] Info Kemasan Box */}
                            <div className="mb-6 space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-5">
                                <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                                    <PackageCheck className="h-5 w-5 text-primary" />{' '}
                                    Detail Kemasan:
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400"></span>
                                        <span>
                                            Berat Bersih:{' '}
                                            <strong>Sesuai Nama Produk</strong>
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400"></span>
                                        <span className="flex items-center gap-1">
                                            Kondisi:{' '}
                                            <strong>Dingin/Segar</strong>{' '}
                                            <Snowflake className="inline h-3 w-3 text-blue-400" />
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400"></span>
                                        <span>
                                            Jaminan:{' '}
                                            <strong>Higienis & Halal</strong>
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="prose prose-sm mb-8 max-w-none text-muted-foreground">
                                <h3 className="mb-2 text-lg font-semibold text-foreground">
                                    Deskripsi
                                </h3>
                                <p className="leading-relaxed">
                                    {product.description ||
                                        'Produk ayam segar berkualitas tinggi, dipotong dengan standar kebersihan ketat. Cocok untuk berbagai masakan rumah maupun usaha kuliner.'}
                                </p>
                            </div>

                            {/* 🛒 Tombol Aksi */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="shine-effect h-14 flex-1 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Tambah Keranjang
                                </Button>

                                <Button
                                    onClick={() =>
                                        handleCheckoutNow(product.id)
                                    }
                                    variant="secondary"
                                    className="h-14 flex-1 border border-gray-200 text-base font-bold"
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Beli Langsung
                                </Button>
                            </div>

                            {/* 💬 Pesan Notifikasi */}
                            {message && (
                                <div
                                    className={`mt-4 flex items-center gap-2 rounded-lg p-3 font-medium animate-in fade-in slide-in-from-bottom-2 ${message.includes('Gagal') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                                >
                                    <CheckCircle className="h-5 w-5" />
                                    <span>{message}</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
