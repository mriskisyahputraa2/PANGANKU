import { Badge } from '@/components/ui/badge';

// Mapping warna berdasarkan status
const statusMap: Record<string, { label: string; className: string }> = {
    menunggu_pembayaran: {
        label: 'Belum Bayar',
        className:
            'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    },
    menunggu_verifikasi: {
        label: 'Perlu Cek',
        className:
            'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    },
    diproses: {
        label: 'Diproses',
        className:
            'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    },
    dikirim: {
        label: 'Dikirim',
        className:
            'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
    },
    siap_diambil: {
        label: 'Siap Pickup',
        className:
            'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
    },
    selesai: {
        label: 'Selesai',
        className:
            'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    },
    dibatalkan: {
        label: 'Batal',
        className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    },
};

export default function StatusBadge({ status }: { status: string }) {
    const config = statusMap[status] || {
        label: status,
        className: 'bg-gray-100 text-gray-800',
    };

    return (
        <Badge
            variant="outline"
            className={`border px-2 py-0.5 text-xs font-medium ${config.className}`}
        >
            {config.label}
        </Badge>
    );
}
