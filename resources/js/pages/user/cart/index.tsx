import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PublicLayout from '@/layouts/public-layout';
import { Head, router } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Import Komponen Pecahan
import CartBottomBar from '@/components/user/cart/cart-bottom-bar';
import CartEmpty from '@/components/user/cart/cart-empty';
import CartItem from '@/components/user/cart/cart-item';
import CartSummary from '@/components/user/cart/cart-summary';

export default function CartIndex({ cart, total }) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // --- LOGIKA BISNIS ---
    const updateQty = (itemId, currentQty, change, maxStock) => {
        const newQty = currentQty + change;
        if (newQty < 1) return;
        if (newQty > maxStock) {
            toast.error(`Stok hanya tersisa ${maxStock}`);
            return;
        }
        router.post(
            `/cart/update/${itemId}`,
            { quantity: newQty },
            { preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/cart/remove/${deleteId}`, {
                onSuccess: () => {
                    toast.success('Produk dihapus');
                    setDeleteId(null);
                },
                preserveScroll: true,
            });
        }
    };

    const handleCheckout = () => router.get('/checkout');

    // --- RENDER ---

    // State Kosong
    if (!cart || cart.items.length === 0) {
        return (
            // [FIX 1] Header Transparan
            <PublicLayout transparentHeader={true}>
                <Head title="Keranjang Belanja" />

                {/* [FIX 2] Padding Atas agar tidak tertutup header */}
                <div className="pt-32 lg:pt-40">
                    <CartEmpty />
                </div>
            </PublicLayout>
        );
    }

    return (
        // [FIX 1] Header Transparan
        <PublicLayout transparentHeader={true}>
            <Head title="Keranjang Belanja" />

            {/* [FIX 2] Padding Atas (pt-32) & Background Relative */}
            <section className="relative min-h-screen bg-gray-50 py-8 pt-32 pb-32 lg:py-12 lg:pt-40 lg:pb-12">
                {/* [FIX 3] Dekorasi Background Gradient Halus */}
                <div className="absolute top-0 left-0 -z-10 h-80 w-full bg-gradient-to-b from-white to-gray-50"></div>

                <div className="container mx-auto max-w-6xl px-4">
                    {/* Header dengan Font Display */}
                    <h1 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-gray-900 md:text-3xl">
                        <ShoppingCart className="h-8 w-8 text-primary" />
                        Keranjang Belanja
                        <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
                            ({cart.items.length} Item)
                        </span>
                    </h1>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                        {/* List Item (Kiri) */}
                        <div className="space-y-4 lg:col-span-2">
                            {cart.items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQty={updateQty}
                                    onRemove={setDeleteId}
                                />
                            ))}
                        </div>

                        {/* Summary (Kanan - Desktop) */}
                        <CartSummary
                            total={total}
                            onCheckout={handleCheckout}
                        />
                    </div>
                </div>
            </section>

            {/* Bottom Bar (Mobile Only) */}
            <CartBottomBar total={total} onCheckout={handleCheckout} />

            {/* Dialog Hapus */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Produk ini akan dihapus dari keranjang belanja Anda.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PublicLayout>
    );
}
