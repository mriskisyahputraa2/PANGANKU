import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { formatRupiah } from '@/lib/utils';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    ImagePlus,
    MapPin,
    MessageCircle,
    Package,
    ShoppingBag,
    Truck,
    Upload,
    User,
    X,
    XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// --- LOGO COMPONENTS (SVG) ---

const LogoDana = () => (
    <svg
        viewBox="0 0 248 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
    >
        <path d="M0 0H248V74H0V0Z" fill="#118EE9" />
        <path
            d="M44.6 22.8H58.9C72.3 22.8 80.8 31.3 80.8 43.8C80.8 56.3 72.2 64.8 58.9 64.8H35.1L44.6 22.8ZM54.5 53.6H58.3C64.7 53.6 68.9 50.3 68.9 43.8C68.9 37.3 64.7 34 58.3 34H50L54.5 53.6ZM110.7 22.8H120.6L133.4 64.8H121.4L118.9 54.7H100.6L97.5 64.8H87L110.7 22.8ZM103.4 45.6H116.2L111.5 29.4L103.4 45.6ZM145.4 22.8H156.6L169.5 47.4V22.8H179.7V64.8H168.6L155.6 40.1V64.8H145.4V22.8ZM208.9 22.8H218.8L231.6 64.8H219.6L217.1 54.7H198.8L195.7 64.8H185.2L208.9 22.8ZM201.6 45.6H214.4L209.7 29.4L201.6 45.6Z"
            fill="white"
        />
    </svg>
);

const LogoGopay = () => (
    <svg
        viewBox="0 0 256 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
    >
        <path d="M0 0H256V74H0V0Z" fill="#00AED6" />
        <path
            d="M197.3 44.4L205.4 25.2H216.9L201.6 59.5C199.2 64.7 196.6 66.6 191.8 66.6C189.7 66.6 188 66.3 186.5 65.7L188 56.8C189.1 57.2 189.8 57.3 191 57.3C192.7 57.3 194 56.5 194.9 54.7L195.6 52.9L183.9 25.2H195.2L197.3 44.4ZM60.4 46.9C57.2 46.9 54.8 45.4 54.2 41.5H71.7C71.9 40.2 72 38.8 72 37.4C72 29.2 66.5 24.3 58.7 24.3C49.7 24.3 43.4 31.3 43.4 41C43.4 50.9 50.9 58 60.5 58C67.8 58 72.4 53.9 73.4 47.3H63.3C63.3 47.3 62.5 46.9 60.4 46.9ZM58.6 32.8C61.4 32.8 62.9 34.5 62.9 36.6H54.3C55.2 34.1 56.9 32.8 58.6 32.8ZM95.5 58C103.7 58 109.8 51.2 109.8 41.2C109.8 31.2 103.7 24.4 95.5 24.4C87.3 24.4 81.2 31.2 81.2 41.2C81.2 51.2 87.3 58 95.5 58ZM95.5 49.1C91.4 49.1 88.7 45.3 88.7 41.2C88.7 37.1 91.4 33.3 95.5 33.3C99.6 33.3 102.3 37.1 102.3 41.2C102.3 45.3 99.6 49.1 95.5 49.1ZM125.5 25.2H136.2V30.8C137.8 27.2 141.1 24.8 145.6 24.8C153.2 24.8 158.3 30.8 158.3 41.2C158.3 51.6 153.2 57.6 145.6 57.6C141.1 57.6 137.8 55.2 136.2 51.6V66H125.5V25.2ZM141.8 48.8C145.3 48.8 147.5 45.9 147.5 41.2C147.5 36.5 145.3 33.6 141.8 33.6C138.3 33.6 136.1 36.5 136.1 41.2C136.1 45.9 138.3 48.8 141.8 48.8ZM179.6 57.2V52.1C177.8 55.6 174.7 57.6 170.5 57.6C163.8 57.6 159.8 53.1 159.8 45.6C159.8 37.6 164.7 33.2 171.6 33.2C173.3 33.2 174.9 33.5 176.3 34L174.4 41.9C173.6 41.7 172.8 41.6 171.9 41.6C169.8 41.6 168.5 42.8 168.5 45.5C168.5 48.2 169.9 49.6 172.3 49.6C174.2 49.6 175.7 48.7 177.1 47.3L179.6 44.8V42.8H172.7V34.8H188.1V57.2H179.6Z"
            fill="white"
        />
    </svg>
);

// --- HELPER COMPONENTS ---

const formatTimeAMPM = (timeString: string) => {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date
        .toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
        .replace('.', ':');
};

const CopyButton = ({ text, label }: { text: string; label: string }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} berhasil disalin!`);
    };
    return (
        <button
            onClick={handleCopy}
            className="ml-2 rounded p-1 text-primary transition-colors hover:bg-primary/10 hover:text-primary/80"
            title={`Salin ${label}`}
        >
            <Copy className="h-3 w-3" />
        </button>
    );
};

const PaymentTimer = ({ createdTimestamp }: { createdTimestamp: number }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const deadline = createdTimestamp + 30 * 60 * 1000; // 30 Menit
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = deadline - now;
            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft('00m 00s');
                setIsExpired(true);
            } else {
                const minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60),
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [createdTimestamp]);

    return (
        <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 font-mono text-sm font-bold ${isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'}`}
        >
            <Clock className="h-4 w-4" />
            <span>{isExpired ? 'Waktu Habis' : timeLeft}</span>
        </div>
    );
};

const OrderTracker = ({ status }: { status: string }) => {
    const steps = [
        { key: 'menunggu_pembayaran', label: 'Bayar' },
        { key: 'menunggu_verifikasi', label: 'Verifikasi' },
        { key: 'diproses', label: 'Diproses' },
        { key: 'dikirim', label: 'Dikirim/Siap' },
        { key: 'selesai', label: 'Selesai' },
    ];
    let activeIndex = 0;
    if (status === 'menunggu_verifikasi') activeIndex = 1;
    if (status === 'diproses') activeIndex = 2;
    if (status === 'dikirim' || status === 'siap_diambil') activeIndex = 3;
    if (status === 'selesai') activeIndex = 4;
    if (status === 'dibatalkan') return null;

    return (
        <div className="w-full py-4">
            <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 rounded-full bg-gray-100"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-primary transition-all duration-500"
                    style={{
                        width: `${(activeIndex / (steps.length - 1)) * 100}%`,
                    }}
                ></div>
                {steps.map((step, index) => {
                    const isActive = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    return (
                        <div
                            key={step.key}
                            className="relative z-10 flex flex-col items-center"
                        >
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 bg-white text-gray-400'} ${isCurrent ? 'scale-110 ring-4 ring-green-100' : ''}`}
                            >
                                {isActive ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <span className="text-xs font-bold">
                                        {index + 1}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`mt-2 hidden text-[10px] font-semibold tracking-wider uppercase sm:block ${isActive ? 'text-primary' : 'text-gray-400'}`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function OrdersShow({ order }: { order: any }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null as File | null,
        _method: 'put',
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('payment_proof', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const clearFile = () => {
        setData('payment_proof', null);
        setPreview(null);
    };

    const handleUploadProof = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.payment_proof) return toast.error('Pilih gambar dulu!');

        router.post(`/orders/${order.id}/upload-proof`, data, {
            forceFormData: true,
            onSuccess: () =>
                toast.success('Bukti pembayaran berhasil dikirim!'),
            onError: () => toast.error('Gagal mengirim bukti.'),
        });
    };

    const handleConfirmReceive = () => {
        if (confirm('Barang sudah diterima dengan baik?')) {
            router.post(
                `/orders/${order.id}/complete`,
                {},
                { onSuccess: () => toast.success('Pesanan selesai!') },
            );
        }
    };
    const handleCancelOrder = () => {
        if (confirm('Batalkan pesanan? Stok akan dikembalikan.')) {
            router.post(
                `/orders/${order.id}/cancel`,
                {},
                { onSuccess: () => toast.success('Pesanan dibatalkan.') },
            );
        }
    };

    const isWaitingPayment = order.status === 'menunggu_pembayaran';
    const isTransfer = ['gopay', 'dana'].includes(order.payment_method);
    const isDelivery = order.delivery_type === 'delivery';
    const isShipped = order.status === 'dikirim';
    const isReadyPickup = order.status === 'siap_diambil';
    const isCancelled = order.status === 'dibatalkan';
    const bankInfo =
        order.payment_method === 'dana'
            ? { name: 'DANA', number: '0812-3456-7890', holder: 'PanganKU' }
            : { name: 'GoPay', number: '0812-3456-7890', holder: 'PanganKU' };

    return (
        <PublicLayout>
            <Head title={`Order #${order.order_number}`} />
            <div className="min-h-screen bg-gray-50/50 pt-8 pb-20">
                <div className="container mx-auto max-w-5xl px-4">
                    {/* HEADER & TRACKER */}
                    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href="/orders"
                            className="group flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all group-hover:scale-110">
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            Kembali ke Riwayat
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Kode Order:
                            </span>
                            <span className="font-mono font-bold text-foreground">
                                {order.order_number}
                            </span>
                            <CopyButton
                                text={order.order_number}
                                label="Kode Order"
                            />
                        </div>
                    </div>

                    {!isCancelled && (
                        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-50 pb-4 sm:flex-row sm:items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Status Pesanan
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Pantau proses pesanan Anda secara
                                        realtime.
                                    </p>
                                </div>
                                {isWaitingPayment && isTransfer && (
                                    <PaymentTimer
                                        createdTimestamp={
                                            order.created_at_timestamp
                                        }
                                    />
                                )}
                            </div>
                            <OrderTracker status={order.status} />
                        </div>
                    )}

                    {isCancelled && (
                        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-6 text-red-800">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Pesanan Dibatalkan
                                </h3>
                                <p className="text-sm opacity-90">
                                    Transaksi ini telah dibatalkan.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* DETAIL ITEM */}
                            <Card className="overflow-hidden border-gray-200 shadow-sm">
                                <CardHeader className="bg-gray-50/50 py-4">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <ShoppingBag className="h-5 w-5 text-primary" />{' '}
                                        Rincian Produk
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {order.items.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 border-b border-gray-100 p-4 transition-colors last:border-0 hover:bg-gray-50/50"
                                        >
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                                                <img
                                                    src={
                                                        item.product?.image
                                                            ? `/storage/${item.product.image}`
                                                            : '/images/placeholder.png'
                                                    }
                                                    alt={item.product?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-center">
                                                <h4 className="line-clamp-2 font-bold text-gray-900">
                                                    {item.product?.name ||
                                                        'Produk dihapus'}
                                                </h4>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {item.quantity} x{' '}
                                                    {formatRupiah(item.price)}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-bold text-gray-900">
                                                    {formatRupiah(
                                                        item.price *
                                                            item.quantity,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                                <div className="bg-gray-50 p-4">
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Subtotal Produk
                                        </span>
                                        <span className="font-medium">
                                            {formatRupiah(order.total_amount)}
                                        </span>
                                    </div>
                                    <div className="mb-4 flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Biaya Layanan
                                        </span>
                                        <span className="font-medium text-green-600">
                                            Gratis
                                        </span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex items-center justify-between text-lg font-bold">
                                        <span>Total Pembayaran</span>
                                        <div className="flex items-center text-primary">
                                            {formatRupiah(order.total_amount)}
                                            <CopyButton
                                                text={order.total_amount.toString()}
                                                label="Nominal"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* UPLOAD BUKTI + ICON BARU */}
                            {isWaitingPayment && isTransfer && (
                                <Card className="border-primary/20 shadow-md ring-1 ring-primary/10">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-base text-primary">
                                            <Upload className="h-5 w-5" />{' '}
                                            Konfirmasi Pembayaran
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-6 rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                                            <p className="mb-2 text-xs font-bold tracking-wide text-yellow-700 uppercase">
                                                Transfer Ke:
                                            </p>
                                            <div className="flex items-center justify-between rounded border border-yellow-200 bg-white p-3 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    {/* GANTI DIV BIASA DENGAN KOMPONEN LOGO */}
                                                    <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded">
                                                        {order.payment_method ===
                                                        'dana' ? (
                                                            <LogoDana />
                                                        ) : (
                                                            <LogoGopay />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">
                                                            {bankInfo.number}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            a.n{' '}
                                                            {bankInfo.holder}
                                                        </p>
                                                    </div>
                                                </div>
                                                <CopyButton
                                                    text={bankInfo.number}
                                                    label="No. Rekening"
                                                />
                                            </div>
                                            <p className="mt-3 text-xs leading-relaxed text-yellow-700">
                                                <AlertTriangle className="mr-1 inline h-3 w-3" />{' '}
                                                Pastikan nominal transfer sesuai
                                                hingga 3 digit terakhir.
                                            </p>
                                        </div>

                                        <form
                                            onSubmit={handleUploadProof}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-2">
                                                <Label>
                                                    Upload Struk / Screenshot
                                                </Label>

                                                {!preview ? (
                                                    <Label
                                                        htmlFor="proof-upload"
                                                        className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-all hover:border-primary hover:bg-gray-50"
                                                    >
                                                        <div className="rounded-full bg-gray-100 p-3 transition-colors group-hover:bg-primary/10">
                                                            <ImagePlus className="h-6 w-6 text-gray-500 group-hover:text-primary" />
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                Klik untuk pilih
                                                                gambar
                                                            </span>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                JPG, PNG atau
                                                                WEBP (Max 5MB)
                                                            </p>
                                                        </div>
                                                        <input
                                                            id="proof-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                        />
                                                    </Label>
                                                ) : (
                                                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                                                                <img
                                                                    src={
                                                                        preview
                                                                    }
                                                                    alt="Preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <p className="truncate text-sm font-medium text-gray-900">
                                                                    {
                                                                        data
                                                                            .payment_proof
                                                                            ?.name
                                                                    }
                                                                </p>
                                                                <p className="flex items-center gap-1 text-xs text-green-600">
                                                                    <CheckCircle2 className="h-3 w-3" />{' '}
                                                                    Siap
                                                                    diupload
                                                                </p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-gray-500 hover:text-red-500"
                                                                onClick={
                                                                    clearFile
                                                                }
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {errors.payment_proof && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.payment_proof}
                                                    </p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                                                disabled={
                                                    processing ||
                                                    !data.payment_proof
                                                }
                                            >
                                                {processing
                                                    ? 'Sedang Mengirim...'
                                                    : 'Kirim Bukti Pembayaran'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                    <CardFooter className="justify-center border-t bg-gray-50 py-3">
                                        <button
                                            onClick={handleCancelOrder}
                                            className="text-xs font-medium text-red-500 hover:underline"
                                        >
                                            Batalkan Pesanan
                                        </button>
                                    </CardFooter>
                                </Card>
                            )}

                            {(isShipped || isReadyPickup) && (
                                <Card className="border-green-200 bg-green-50/50 shadow-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                                            <Package className="h-7 w-7 text-green-600" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-green-800">
                                            {isDelivery
                                                ? 'Paket Sedang Diantar Kurir'
                                                : 'Pesanan Siap Diambil'}
                                        </h3>
                                        <p className="mx-auto mb-6 max-w-md text-sm text-green-700">
                                            {isDelivery
                                                ? 'Jika paket sudah sampai dan kondisinya baik, silakan selesaikan pesanan.'
                                                : 'Silakan datang ke toko kami. Tunjukkan Kode Order kepada kasir.'}
                                        </p>
                                        <Button
                                            onClick={handleConfirmReceive}
                                            className="w-full bg-green-600 py-6 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700"
                                        >
                                            Konfirmasi Barang Diterima
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Truck className="h-4 w-4" /> Detail
                                        Pengiriman
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 text-sm">
                                    <div>
                                        <span className="text-xs text-muted-foreground">
                                            Tipe Pengiriman
                                        </span>
                                        <div className="mt-1 flex items-center gap-2 font-medium">
                                            {isDelivery ? (
                                                <Badge variant="secondary">
                                                    <Truck className="mr-1 h-3 w-3" />{' '}
                                                    Delivery
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    <ShoppingBag className="mr-1 h-3 w-3" />{' '}
                                                    Pickup
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground">
                                            Lokasi Tujuan / Ambil
                                        </span>
                                        <div className="mt-1 flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <p className="leading-snug font-medium text-gray-700">
                                                {isDelivery
                                                    ? order.shipping_address
                                                    : 'Toko PanganKU - Jl. Politeknik No. 1'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground">
                                            Waktu Request
                                        </span>
                                        <div className="mt-1 flex items-center gap-2 font-medium">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            {formatTimeAMPM(order.pickup_time)}
                                        </div>
                                    </div>
                                    {order.tracking_number && (
                                        <div className="rounded-lg border border-dashed bg-gray-50 p-3">
                                            <span className="mb-2 block text-xs text-gray-500">
                                                Kurir / Pengantar
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                                    <User className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <p className="font-bold text-gray-900">
                                                    {order.tracking_number}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <CreditCard className="h-4 w-4" />{' '}
                                        Detail Pembayaran
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Metode
                                        </span>
                                        <span className="font-bold uppercase">
                                            {order.payment_method}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Status
                                        </span>
                                        <Badge
                                            variant={
                                                order.payment_status === 'paid'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {order.payment_status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <a
                                href={`https://wa.me/628123456789?text=Halo%20Admin,%20saya%20butuh%20bantuan%20untuk%20order%20${order.order_number}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full border-primary text-primary hover:bg-primary/5"
                                >
                                    <MessageCircle className="mr-2 h-4 w-4" />{' '}
                                    Hubungi Bantuan
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
