import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CreditCard, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

// Tipe data untuk item keranjang
interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image: string; // Ini adalah URL lengkap, bukan filename
    };
}

interface CartPageProps {
    items: CartItem[];
}

const defaultProductImage = '/images/placeholder/default-product.png';

// Helper format Rupiah
const formatAsRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function CartPage() {
    const { items = [] } = usePage().props as unknown as CartPageProps;

    const handleUpdate = (id: number, quantity: number) => {
        if (quantity < 1) {
            handleRemove(id);
            return;
        }
        router.post(
            `/cart/update/${id}`,
            { quantity },
            {
                preserveScroll: true,
            },
        );
    };

    const handleRemove = (id: number) => {
        if (confirm('Hapus produk ini dari keranjang?')) {
            router.delete(`/cart/remove/${id}`);
        }
    };

    const total = items.reduce(
        (sum, i) => sum + (i.product.price || 0) * i.quantity,
        0,
    );

    return (
        <PublicLayout>
            <Head title="Keranjang Belanja" />

            <section className="min-h-[70vh] bg-background py-16 md:py-24">
                <div className="container mx-auto max-w-6xl px-6">
                    {/* Tampilan jika Keranjang Kosong */}
                    {items.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-lg">
                            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                            <h1 className="mb-2 text-3xl font-bold text-foreground">
                                Keranjang Anda Kosong
                            </h1>
                            <p className="mb-6 text-muted-foreground">
                                Sepertinya Anda belum menambahkan produk apapun.
                            </p>
                            <Link href="/products">
                                <Button className="shine-effect" size="lg">
                                    Mulai Belanja
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        // Tampilan jika Keranjang Ada Isinya (Layout 2 Kolom)
                        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                            {/* Kolom Kiri: Daftar Item */}
                            <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-lg lg:col-span-2">
                                <h1 className="mb-4 text-2xl font-bold text-foreground">
                                    Keranjang Belanja ({items.length} item)
                                </h1>
                                <Separator />
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col items-start justify-between gap-4 border-b border-border py-4 sm:flex-row sm:items-center"
                                    >
                                        {/* Info Produk */}
                                        <div className="flex items-center gap-4">
                                            {/* ================================== */}
                                            {/* ## PERBAIKAN GAMBAR DI SINI ## */}
                                            {/* ================================== */}
                                            <img
                                                src={
                                                    item.product.image // Langsung gunakan URL
                                                        ? item.product.image
                                                        : defaultProductImage
                                                }
                                                alt={item.product.name}
                                                className="h-20 w-20 rounded-lg border border-border object-cover"
                                                onError={(e) =>
                                                    (e.currentTarget.src =
                                                        defaultProductImage)
                                                }
                                            />
                                            {/* ================================== */}
                                            {/* ##   SELESAI DIPERBAIKI   ## */}
                                            {/* ================================== */}

                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatAsRupiah(
                                                        item.product.price,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
                                            {/* Tombol Kuantitas */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        handleUpdate(
                                                            item.id,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-10 text-center font-medium text-foreground">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        handleUpdate(
                                                            item.id,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Harga Total & Hapus */}
                                            <div className="flex items-center gap-2 text-right">
                                                <p className="w-28 font-semibold text-foreground">
                                                    {formatAsRupiah(
                                                        item.product.price *
                                                            item.quantity,
                                                    )}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleRemove(item.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Kolom Kanan: Ringkasan Pesanan (Sticky) */}
                            <div className="sticky top-28 lg:col-span-1">
                                <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-foreground">
                                        Ringkasan Pesanan
                                    </h2>
                                    <Separator />
                                    <div className="flex items-center justify-between text-foreground">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span className="text-lg font-semibold">
                                            {formatAsRupiah(total)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">
                                        *Biaya pengiriman akan dihitung saat
                                        checkout.
                                    </p>
                                    <Link href="/checkout" className="w-full">
                                        <Button
                                            className="shine-effect w-full"
                                            size="lg"
                                        >
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Lanjut ke Checkout
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
