import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export default function CartEmpty() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center duration-500 animate-in fade-in zoom-in">
            <div className="mb-6 rounded-full bg-gray-100 p-6">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
                Keranjang Belanjamu Kosong
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
                Sepertinya kamu belum menambahkan ayam segar ke sini. Yuk, isi
                keranjangmu sekarang!
            </p>
            <Link href="/products" className="mt-8">
                <Button
                    size="lg"
                    className="font-bold shadow-lg shadow-primary/20"
                >
                    Mulai Belanja Sekarang
                </Button>
            </Link>
        </div>
    );
}
