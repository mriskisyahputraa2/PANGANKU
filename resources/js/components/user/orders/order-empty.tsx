import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export default function OrderEmpty({ currentStatus, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center bg-white px-4 py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
                <Filter className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
                Tidak ada pesanan
            </h3>
            <p className="mx-auto mb-6 max-w-xs text-sm text-muted-foreground">
                Tidak ditemukan pesanan dengan status ini.
            </p>
            {currentStatus !== 'all' && (
                <Button variant="outline" onClick={onReset}>
                    Lihat Semua Pesanan
                </Button>
            )}
        </div>
    );
}
