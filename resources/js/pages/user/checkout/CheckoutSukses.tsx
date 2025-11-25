import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
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
    status: string; // [PENTING] Kita butuh status untuk logika tampilan
    created_at: string;
}

export default function CheckoutSukses({ order }: { order: Order }) {
    // Data Rekening (Bisa diambil dari database settings jika ada)
    const bankAccounts = [
        { name: 'DANA', number: '0812-3456-7890', holder: 'PanganKU' },
        { name: 'GoPay', number: '0812-3456-7890', holder: 'PanganKU' },
    ];

    // --- LOGIKA KONDISIONAL ---
    const isDelivery = order.delivery_type === 'delivery';

    // Cek Status Pesanan
    const isPendingPayment = order.status === 'menunggu_pembayaran';
    const isWaitingVerification = order.status === 'menunggu_verifikasi';
    const isCOD = order.payment_method === 'tunai';

    return (
        <PublicLayout>
            <Head title="Status Pesanan" />

            <section className="flex min-h-screen items-center justify-center bg-gray-50 py-16">
                <div className="container max-w-2xl px-4">
                    <Card className="overflow-hidden border-t-4 border-t-primary shadow-lg">
                        {/* --- 1. HEADER STATUS (DINAMIS) --- */}
                        <div className="bg-white p-8 text-center">
                            {isPendingPayment ? (
                                // TAMPILAN A: BELUM BAYAR (Kuning/Oranye)
                                <>
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                                        <Clock className="h-10 w-10 text-yellow-600" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Pesanan Berhasil Dibuat!
                                    </h1>
                                    <p className="mt-2 text-gray-600">
                                        Menunggu pembayaran untuk kode:{' '}
                                        <span className="font-bold text-primary">
                                            {order.order_number}
                                        </span>
                                    </p>
                                </>
                            ) : (
                                // TAMPILAN B: SUDAH UPLOAD / COD (Hijau)
                                <>
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                        <CheckCircle className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Pesanan Sedang Diproses!
                                    </h1>
                                    <p className="mt-2 text-gray-600">
                                        Kode Pesanan:{' '}
                                        <span className="font-bold text-primary">
                                            {order.order_number}
                                        </span>
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="bg-gray-50 px-8 py-6">
                            {/* --- 2. LOGIKA INSTRUKSI PEMBAYARAN --- */}

                            {/* KASUS A: TRANSFER TAPI BELUM UPLOAD (Tampilkan Instruksi Transfer) */}
                            {isPendingPayment && (
                                <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-yellow-800">
                                        <Wallet className="h-5 w-5" /> Instruksi
                                        Pembayaran
                                    </h3>
                                    <p className="mb-4 text-sm text-yellow-800">
                                        Silakan transfer sejumlah{' '}
                                        <strong className="text-lg text-gray-900">
                                            {formatRupiah(order.total_amount)}
                                        </strong>{' '}
                                        ke salah satu rekening di bawah ini{' '}
                                        <strong>dalam 30 menit</strong>:
                                    </p>

                                    <div className="space-y-3 rounded-lg border border-yellow-100 bg-white p-4">
                                        {bankAccounts.map((bank, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
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
                                                    <p className="font-mono font-bold text-gray-900">
                                                        {bank.number}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex gap-2 text-xs text-yellow-700">
                                        <Clock className="h-4 w-4 shrink-0" />
                                        <p>
                                            Mohon segera upload bukti pembayaran
                                            di halaman Detail Pesanan agar
                                            pesanan tidak dibatalkan otomatis.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* KASUS B: SUDAH UPLOAD BUKTI (Tampilkan Info Verifikasi) */}
                            {isWaitingVerification && !isCOD && (
                                <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
                                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-blue-800">
                                        <FileCheck className="h-5 w-5" /> Bukti
                                        Diterima
                                    </h3>
                                    <p className="text-sm text-blue-800">
                                        Terima kasih! Bukti pembayaran Anda
                                        sudah kami terima. Admin kami akan
                                        segera memverifikasi pesanan Anda. Tidak
                                        perlu tindakan lebih lanjut.
                                    </p>
                                </div>
                            )}

                            {/* KASUS C: COD (Tampilkan Info Siapkan Uang) */}
                            {isCOD && (
                                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6">
                                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-green-800">
                                        <Wallet className="h-5 w-5" /> Metode
                                        Tunai (COD)
                                    </h3>
                                    <p className="text-sm text-green-800">
                                        Pesanan telah dikonfirmasi. Mohon
                                        siapkan uang tunai pas sebesar{' '}
                                        <strong>
                                            {formatRupiah(order.total_amount)}
                                        </strong>{' '}
                                        saat menerima pesanan.
                                    </p>
                                </div>
                            )}

                            {/* --- 3. INFORMASI PENGAMBILAN/PENGIRIMAN (TETAP ADA) --- */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-3 text-sm font-bold tracking-wide text-gray-500 uppercase">
                                    Informasi Pengiriman
                                </h3>

                                {isDelivery ? (
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <Truck className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                Pesanan Akan Diantar
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Kurir akan menghubungi Anda
                                                sekitar pukul{' '}
                                                <strong>
                                                    {order.pickup_time}
                                                </strong>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                Ambil Sendiri di Toko
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Silakan datang ke toko kami pada
                                                pukul{' '}
                                                <strong>
                                                    {order.pickup_time}
                                                </strong>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* --- 4. TOMBOL AKSI --- */}
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="w-full"
                                >
                                    <Button className="w-full py-6 text-base shadow-sm">
                                        {isPendingPayment
                                            ? 'Upload Bukti Sekarang'
                                            : 'Lihat Detail Pesanan'}
                                    </Button>
                                </Link>
                                <Link href="/products" className="w-full">
                                    <Button
                                        variant="outline"
                                        className="w-full py-6 text-base"
                                    >
                                        Kembali Belanja
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
