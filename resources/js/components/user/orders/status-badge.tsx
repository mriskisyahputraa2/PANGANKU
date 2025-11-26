import { Badge } from '@/components/ui/badge';

const styles: Record<string, string> = {
    menunggu_pembayaran: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    menunggu_verifikasi: 'bg-blue-50 text-blue-700 border-blue-200',
    diproses: 'bg-orange-50 text-orange-700 border-orange-200',
    dikirim: 'bg-purple-50 text-purple-700 border-purple-200',
    siap_diambil: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    selesai: 'bg-green-50 text-green-700 border-green-200',
    dibatalkan: 'bg-red-50 text-red-700 border-red-200',
};

export default function StatusBadge({ status }: { status: string }) {
    const label = status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    const className =
        styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';

    return (
        <Badge
            className={`border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}
            variant="outline"
        >
            {label}
        </Badge>
    );
}
