import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { formatRupiah } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    ImagePlus,
    MapPin,
    ShoppingBag,
    Store,
    Truck,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// --- LOGO COMPONENTS ---
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

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface CartItem {
    id: number;
    quantity: number;
    product: Product;
}

interface CheckoutProps {
    items: CartItem[];
    total: number;
    product_id?: number;
    user: { name: string; customer_phone?: string };
}

export default function CheckoutIndex({
    items,
    total,
    product_id,
    user,
}: CheckoutProps) {
    const { errors: globalErrors } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        customer_name: user.name || '',
        customer_phone: user.customer_phone || '',
        shipping_address: '',
        delivery_type: 'delivery',
        pickup_time: '',
        payment_method: 'tunai',
        product_id: product_id || null,
        payment_proof: null as File | null,
    });

    const [isDelivery, setIsDelivery] = useState(true);
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

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleDeliveryTypeChange = (type: 'delivery' | 'pickup') => {
        setIsDelivery(type === 'delivery');
        setData('delivery_type', type);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Pesanan berhasil dibuat!'),
            onError: () =>
                toast.error('Gagal memproses pesanan. Periksa inputan Anda.'),
        });
    };

    return (
        <PublicLayout transparentHeader={true}>
            <Head title="Checkout Pesanan" />

            {/* [FIX 2] Padding Atas & Background Dekorasi */}
            <section className="relative min-h-screen bg-gray-50 py-12 pt-32 lg:pt-40">
                <div className="absolute top-0 left-0 -z-10 h-80 w-full bg-gradient-to-b from-white to-gray-50"></div>

                <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                    {/* Breadcrumb / Header */}
                    <div className="mb-8">
                        <Link
                            href="/cart"
                            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali ke
                            Keranjang
                        </Link>
                        <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 md:text-4xl">
                            <CreditCard className="h-8 w-8 text-primary" />{' '}
                            Checkout Pesanan
                        </h1>
                    </div>

                    {globalErrors.error && (
                        <div className="mb-6 flex animate-pulse items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                            <AlertCircle className="h-5 w-5" />
                            <p className="font-medium">
                                <strong>Gagal:</strong> {globalErrors.error}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                    >
                        {/* KOLOM KIRI: INPUT DATA */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* 1. Informasi Kontak */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                                        1
                                    </div>
                                    Informasi Kontak
                                </h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nama Penerima
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.customer_name}
                                            onChange={(e) =>
                                                setData(
                                                    'customer_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.customer_name}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Nomor WhatsApp
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={data.customer_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'customer_phone',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.customer_phone}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Metode Pengiriman */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                                        2
                                    </div>
                                    Metode Pengiriman
                                </h2>

                                <div className="mb-6 grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() =>
                                            handleDeliveryTypeChange('delivery')
                                        }
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${isDelivery ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-primary/30'}`}
                                    >
                                        <Truck className="h-6 w-6" />
                                        <span className="text-sm font-bold">
                                            Diantar Kurir
                                        </span>
                                    </div>
                                    <div
                                        onClick={() =>
                                            handleDeliveryTypeChange('pickup')
                                        }
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${!isDelivery ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-primary/30'}`}
                                    >
                                        <Store className="h-6 w-6" />
                                        <span className="text-sm font-bold">
                                            Ambil di Toko
                                        </span>
                                    </div>
                                </div>

                                {isDelivery ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label>Alamat Lengkap</Label>
                                            <Textarea
                                                rows={3}
                                                value={data.shipping_address}
                                                onChange={(e) =>
                                                    setData(
                                                        'shipping_address',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Jalan, Nomor Rumah, Patokan..."
                                            />
                                            <InputError
                                                message={
                                                    errors.shipping_address
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jam Pengantaran</Label>
                                            <Input
                                                type="time"
                                                value={data.pickup_time}
                                                onChange={(e) =>
                                                    setData(
                                                        'pickup_time',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.pickup_time}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                                            <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                                            <div>
                                                <p className="font-bold">
                                                    Lokasi Toko:
                                                </p>
                                                <p>
                                                    Jl. Politeknik No. 1,
                                                    Lhokseumawe.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jam Pengambilan</Label>
                                            <Input
                                                type="time"
                                                value={data.pickup_time}
                                                onChange={(e) =>
                                                    setData(
                                                        'pickup_time',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.pickup_time}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 3. Pembayaran */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                                        3
                                    </div>
                                    Pembayaran
                                </h2>

                                <RadioGroup
                                    value={data.payment_method}
                                    onValueChange={(val) => {
                                        setData('payment_method', val);
                                        if (val === 'tunai') clearFile();
                                    }}
                                    className="space-y-3"
                                >
                                    {/* Opsi Tunai */}
                                    <div
                                        className={`flex cursor-pointer items-center space-x-3 rounded-xl border p-4 transition-all hover:bg-gray-50 ${data.payment_method === 'tunai' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                                    >
                                        <RadioGroupItem
                                            value="tunai"
                                            id="tunai"
                                        />
                                        <Label
                                            htmlFor="tunai"
                                            className="flex-1 cursor-pointer font-medium"
                                        >
                                            Tunai (COD){' '}
                                            <span className="ml-1 font-normal text-muted-foreground">
                                                - Bayar ditempat
                                            </span>
                                        </Label>
                                    </div>

                                    {/* Opsi Transfer */}
                                    {['dana', 'gopay'].map((method) => (
                                        <div
                                            key={method}
                                            className={`rounded-xl border p-4 transition-all ${data.payment_method === method ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-300'}`}
                                        >
                                            <div className="mb-2 flex items-center space-x-3">
                                                <RadioGroupItem
                                                    value={method}
                                                    id={method}
                                                />
                                                <Label
                                                    htmlFor={method}
                                                    className="flex flex-1 cursor-pointer items-center gap-2 font-medium capitalize"
                                                >
                                                    Transfer {method}
                                                </Label>
                                            </div>

                                            {data.payment_method === method && (
                                                <div className="mt-4 ml-7 animate-in fade-in slide-in-from-top-2">
                                                    <div className="mb-4 rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-sm text-gray-700">
                                                        <div className="mb-1 flex items-center justify-between">
                                                            <span className="text-xs font-bold tracking-wider text-yellow-600 uppercase">
                                                                Transfer Ke
                                                            </span>
                                                            <div className="h-6">
                                                                {method ===
                                                                'dana' ? (
                                                                    <LogoDana />
                                                                ) : (
                                                                    <LogoGopay />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="font-mono text-xl font-bold tracking-wide text-gray-900">
                                                            0812-3456-7890
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            a.n PanganKU
                                                        </p>
                                                    </div>

                                                    {/* Upload Bukti */}
                                                    {!preview ? (
                                                        <Label
                                                            htmlFor="proof-upload"
                                                            className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 text-gray-500 transition-all hover:border-primary hover:bg-gray-50 hover:text-primary"
                                                        >
                                                            <div className="rounded-full bg-gray-100 p-3 transition-colors group-hover:bg-primary/10">
                                                                <ImagePlus className="h-6 w-6 text-gray-500 group-hover:text-primary" />
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="text-sm font-medium">
                                                                    Upload Bukti
                                                                    Transfer
                                                                </span>
                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    JPG, PNG
                                                                    (Max 5MB)
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
                                                        <div className="group relative mt-2 w-fit">
                                                            <img
                                                                src={preview}
                                                                alt="Preview"
                                                                className="h-48 w-auto rounded-lg border object-cover shadow-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    clearFile
                                                                }
                                                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white shadow-md transition-transform hover:scale-110 hover:bg-red-600"
                                                                title="Hapus"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                            <p className="mt-2 flex items-center justify-center gap-1 text-center text-xs font-bold text-green-600">
                                                                <CheckCircle2 className="h-3 w-3" />{' '}
                                                                Bukti Siap
                                                            </p>
                                                        </div>
                                                    )}
                                                    <InputError
                                                        message={
                                                            errors.payment_proof
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </RadioGroup>
                                <InputError message={errors.payment_method} />
                            </div>
                        </div>

                        {/* KOLOM KANAN: RINGKASAN (STICKY) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                                <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
                                    <ShoppingBag className="h-5 w-5 text-primary" />{' '}
                                    Ringkasan Pesanan
                                </h2>

                                <div className="custom-scrollbar mb-6 max-h-[300px] space-y-4 overflow-y-auto pr-2">
                                    {items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-3 border-b pb-3 last:border-0 last:pb-0"
                                        >
                                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                                                <img
                                                    src={
                                                        item.product.image
                                                            ? `/storage/${item.product.image}`
                                                            : '/images/placeholder.png'
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-center">
                                                <span className="line-clamp-1 text-sm font-medium text-gray-900">
                                                    {item.product.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {item.quantity} x{' '}
                                                    {formatRupiah(
                                                        item.product.price,
                                                    )}
                                                </span>
                                            </div>
                                            <span className="self-center text-sm font-bold text-gray-900">
                                                {formatRupiah(
                                                    item.product.price *
                                                        item.quantity,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal Produk
                                        </span>
                                        <span>{formatRupiah(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Biaya Layanan
                                        </span>
                                        <span className="font-medium text-green-600">
                                            Gratis
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between border-t pt-2">
                                        <span className="text-lg font-bold">
                                            Total Bayar
                                        </span>
                                        <span className="text-xl font-bold text-primary">
                                            {formatRupiah(total)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-6 h-12 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Memproses...'
                                        : 'Buat Pesanan Sekarang'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}
