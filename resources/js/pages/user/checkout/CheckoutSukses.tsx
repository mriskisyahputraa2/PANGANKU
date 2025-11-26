import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    FileCheck,
    MapPin,
    Truck,
    Wallet,
} from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    payment_method: string;
    delivery_type: string;
    pickup_time: string;
    status: string;
    created_at: string;
}

export default function CheckoutSukses({ order }: { order: Order }) {
    // Data Rekening
    const bankAccounts = [
        { name: 'DANA', number: '0812-3456-7890', holder: 'PanganKU' },
        { name: 'GoPay', number: '0812-3456-7890', holder: 'PanganKU' },
    ];

    // --- LOGIKA KONDISIONAL ---
    const isDelivery = order.delivery_type === 'delivery';
    const isPendingPayment = order.status === 'menunggu_pembayaran';
    const isWaitingVerification = order.status === 'menunggu_verifikasi';
    const isCOD = order.payment_method === 'tunai';

    return (
        // Tanpa PublicLayout (Halaman Full Screen Kosong)
        <>
            <Head title="Status Pesanan" />

            <section className="relative flex min-h-screen items-center justify-center bg-gray-50 py-12">
                {/* Background Gradient Halus */}
                <div className="absolute top-0 left-0 -z-10 h-1/2 w-full bg-gradient-to-b from-green-50/50 to-transparent"></div>

                <div className="relative z-10 container max-w-2xl px-4">
                    {/* Kartu Utama */}
                    <Card className="overflow-hidden border-t-4 border-t-primary shadow-2xl duration-500 animate-in fade-in zoom-in">
                        {/* 1. HEADER STATUS */}
                        <div className="border-b border-gray-100 bg-white p-8 text-center">
                            {isPendingPayment ? (
                                // TAMPILAN: BELUM BAYAR
                                <>
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-100 bg-yellow-50 shadow-sm">
                                        <Clock className="h-10 w-10 animate-pulse text-yellow-600" />
                                    </div>
                                    <h1 className="mb-2 font-display text-3xl font-bold text-gray-900">
                                        Pesanan Berhasil Dibuat!
                                    </h1>
                                    <p className="text-gray-500">
                                        Kode Pesanan:{' '}
                                        <span className="font-mono text-lg font-bold text-primary">
                                            {order.order_number}
                                        </span>
                                    </p>
                                </>
                            ) : (
                                // TAMPILAN: DIPROSES / SELESAI
                                <>
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-100 bg-green-50 shadow-sm">
                                        <CheckCircle className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h1 className="mb-2 font-display text-3xl font-bold text-gray-900">
                                        Pesanan Sedang Diproses!
                                    </h1>
                                    <p className="text-gray-500">
                                        Kode Pesanan:{' '}
                                        <span className="font-mono text-lg font-bold text-primary">
                                            {order.order_number}
                                        </span>
                                    </p>
                                </>
                            )}
                        </div>

                        {/* 2. KONTEN UTAMA */}
                        <div className="space-y-8 bg-gray-50/50 px-8 py-8">
                            {/* KOTAK INSTRUKSI PEMBAYARAN */}
                            {isPendingPayment && (
                                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-yellow-800">
                                        <Wallet className="h-5 w-5" />{' '}
                                        Selesaikan Pembayaran
                                    </h3>
                                    <p className="mb-4 text-sm leading-relaxed text-yellow-800/80">
                                        Silakan transfer senilai{' '}
                                        <strong className="text-lg text-gray-900">
                                            {formatRupiah(order.total_amount)}
                                        </strong>{' '}
                                        ke salah satu rekening berikut dalam
                                        waktu <strong>30 menit</strong>:
                                    </p>

                                    <div className="space-y-3 rounded-xl border border-yellow-100 bg-white p-4 shadow-sm">
                                        {bankAccounts.map((bank, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                                            >
                                                <div>
                                                    <p className="font-bold text-gray-800">
                                                        {bank.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        a.n {bank.holder}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono text-lg font-bold text-gray-900">
                                                        {bank.number}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex gap-2 rounded-lg bg-yellow-100/50 p-2 text-xs text-yellow-700">
                                        <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                                        <p>
                                            Jangan lupa upload bukti pembayaran
                                            di halaman Detail Pesanan agar tidak
                                            dibatalkan otomatis.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* KOTAK INFO LAINNYA (Verifikasi / COD) */}
                            {isWaitingVerification && !isCOD && (
                                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <FileCheck className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-blue-900">
                                        Bukti Pembayaran Diterima
                                    </h3>
                                    <p className="text-sm leading-relaxed text-blue-700">
                                        Terima kasih! Admin kami sedang
                                        memverifikasi bukti pembayaran Anda.
                                        Mohon tunggu sebentar.
                                    </p>
                                </div>
                            )}

                            {isCOD && (
                                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Wallet className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-green-900">
                                        Metode Bayar di Tempat (COD)
                                    </h3>
                                    <p className="text-sm leading-relaxed text-green-700">
                                        Pesanan dikonfirmasi. Siapkan uang tunai
                                        pas sebesar{' '}
                                        <strong>
                                            {formatRupiah(order.total_amount)}
                                        </strong>{' '}
                                        saat kurir tiba.
                                    </p>
                                </div>
                            )}

                            {/* KOTAK PENGIRIMAN */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                    Info Pengiriman
                                </h3>

                                {isDelivery ? (
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-primary/10 p-3 text-primary">
                                            <Truck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-900">
                                                Pesanan Akan Diantar
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Kurir akan menghubungi Anda
                                                sekitar pukul{' '}
                                                <span className="font-semibold text-gray-900">
                                                    {order.pickup_time}
                                                </span>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-primary/10 p-3 text-primary">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-900">
                                                Ambil Sendiri di Toko
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Silakan datang ke toko kami pada
                                                pukul{' '}
                                                <span className="font-semibold text-gray-900">
                                                    {order.pickup_time}
                                                </span>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TOMBOL AKSI */}
                            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="w-full"
                                >
                                    <Button className="h-14 w-full text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl">
                                        {isPendingPayment
                                            ? 'Upload Bukti Sekarang'
                                            : 'Lihat Detail Pesanan'}
                                    </Button>
                                </Link>
                                <Link href="/products" className="w-full">
                                    <Button
                                        variant="outline"
                                        className="h-14 w-full border-gray-200 bg-white text-base font-bold hover:bg-gray-50"
                                    >
                                        Kembali Belanja
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        &copy; 2025 PanganKU. Terima kasih telah berbelanja.
                    </p>
                </div>
            </section>
        </>
    );
}
