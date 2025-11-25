import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    CreditCard,
    Hash,
    MapPin,
    MessageCircle,
    Package,
    Truck,
    User,
} from 'lucide-react';

// Import Components
import ActionButtons from '@/components/admin/orders/detail/action-buttons';
import ItemsTable from '@/components/admin/orders/detail/order-summary';
import StatusBadge from '@/components/admin/orders/status-badge';
import { formatRupiah } from '@/lib/utils';

// --- HELPERS BARU ---

// 1. Format Jam ke AM/PM
const formatTimeAMPM = (timeString) => {
    if (!timeString) return '-';
    // Asumsi timeString format "HH:mm" atau "HH:mm:ss"
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));

    // Format ke en-US agar muncul AM/PM
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

// 2. Generate Link WhatsApp
const getWhatsappUrl = (phone) => {
    if (!phone) return '#';
    // Hapus karakter non-angka
    let formatted = phone.replace(/\D/g, '');
    // Ganti 0 di depan dengan 62
    if (formatted.startsWith('0')) {
        formatted = '62' + formatted.slice(1);
    }
    return `https://wa.me/${formatted}`;
};

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Pesanan', href: '/admin/orders' },
    { title: 'Detail Pesanan' },
];

export default function OrderShow({ order }) {
    const isDelivery = order.delivery_type === 'delivery';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.order_number}`} />

            <div className="w-full space-y-6 p-4 sm:p-6">
                {/* HEADER */}
                <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 shrink-0"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="mb-1 flex items-center gap-3">
                                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                                    {order.order_number}
                                </h1>
                                <StatusBadge status={order.status} />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />{' '}
                                    {new Date(order.created_at).toLocaleString(
                                        'id-ID',
                                    )}
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" /> ID: {order.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <ActionButtons order={order} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* === KOLOM KIRI (2/3) === */}
                    <div className="space-y-6 xl:col-span-2">
                        <ItemsTable order={order} />

                        <Card>
                            <CardHeader className="border-b bg-gray-50/50 py-3">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <CreditCard className="h-4 w-4 text-gray-500" />{' '}
                                    Rincian Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b py-2">
                                            <span className="text-sm text-muted-foreground">
                                                Metode Bayar
                                            </span>
                                            <span className="font-bold uppercase">
                                                {order.payment_method}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-b py-2">
                                            <span className="text-sm text-muted-foreground">
                                                Status Bayar
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold uppercase ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                            >
                                                {order.payment_status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-sm text-muted-foreground">
                                                Total Tagihan
                                            </span>
                                            <span className="text-lg font-bold text-primary">
                                                {formatRupiah(
                                                    order.total_amount,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-3 text-xs font-bold text-muted-foreground uppercase">
                                            Lampiran Bukti
                                        </p>
                                        {order.payment_proof ? (
                                            <a
                                                href={`/storage/${order.payment_proof}`}
                                                target="_blank"
                                                className="group relative block h-40 w-full overflow-hidden rounded-lg border bg-gray-100"
                                            >
                                                <img
                                                    src={`/storage/${order.payment_proof}`}
                                                    alt="Bukti"
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                    Lihat Gambar Asli
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 text-xs text-muted-foreground">
                                                <span className="mb-1 text-lg opacity-50">
                                                    🚫
                                                </span>
                                                Tidak ada bukti
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* === KOLOM KANAN (1/3) === */}
                    <div className="space-y-6">
                        <Card className="h-fit">
                            <CardHeader className="border-b bg-gray-50/50 py-3">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <User className="h-4 w-4 text-gray-500" />{' '}
                                    Data Pelanggan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-5">
                                {/* Info User */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary uppercase">
                                        {order.customer_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {order.customer_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            User ID: {order.user_id || '-'}
                                        </p>

                                        {/* [PERBAIKAN 1] Link WhatsApp */}
                                        <a
                                            href={getWhatsappUrl(
                                                order.customer_phone,
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-1.5 flex items-center gap-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700 hover:underline"
                                            title="Chat via WhatsApp"
                                        >
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            {order.customer_phone}
                                        </a>
                                    </div>
                                </div>

                                <Separator />

                                {/* Info Pengiriman */}
                                <div>
                                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                                        {isDelivery ? (
                                            <Truck className="h-3 w-3" />
                                        ) : (
                                            <Package className="h-3 w-3" />
                                        )}
                                        Info Pengiriman
                                    </h4>

                                    <div className="space-y-4 text-sm">
                                        <div className="rounded border bg-gray-50 p-3">
                                            <span className="mb-1 block text-xs text-gray-500">
                                                Tipe:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {isDelivery
                                                    ? 'Diantar Kurir (Delivery)'
                                                    : 'Ambil Sendiri (Pickup)'}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="mb-1 block text-xs text-gray-500">
                                                Alamat Tujuan:
                                            </span>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                                <p className="leading-snug">
                                                    {isDelivery
                                                        ? order.shipping_address
                                                        : 'Toko PanganKU - Jl. Politeknik No. 1'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="mb-1 block text-xs text-gray-500">
                                                Waktu Request:
                                            </span>
                                            <div className="flex items-center gap-2 rounded bg-blue-50 px-3 py-2 font-mono font-medium text-blue-700">
                                                <Clock className="h-4 w-4" />
                                                {/* [PERBAIKAN 2] Format AM/PM */}
                                                {formatTimeAMPM(
                                                    order.pickup_time,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
