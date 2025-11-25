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
            <PublicLayout>
                <Head title="Keranjang Belanja" />
                <CartEmpty />
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Keranjang Belanja" />

            <section className="min-h-screen bg-gray-50 py-8 pb-32 lg:py-12 lg:pb-12">
                <div className="container mx-auto max-w-6xl px-4">
                    {/* Header */}
                    <h1 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 lg:text-2xl">
                        <ShoppingCart className="h-6 w-6" /> Keranjang Belanja
                        <span className="text-sm font-normal text-muted-foreground lg:text-base">
                            ({cart.items.length} Item)
                        </span>
                    </h1>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PublicLayout>
    );
}
