import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function CartBottomBar({ total, onCheckout }) {
    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full lg:hidden">
            <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                        Total Pembayaran
                    </span>
                    <span className="text-lg font-extrabold text-primary">
                        {formatRupiah(total)}
                    </span>
                </div>
                <Button
                    onClick={onCheckout}
                    size="lg"
                    className="px-8 font-bold shadow-md shadow-primary/20"
                >
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
