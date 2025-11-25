import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { formatRupiah } from '@/lib/utils';
import { Head, useForm, usePage } from '@inertiajs/react';
// [BARU] Import Icon ImagePlus (untuk tombol upload) dan X (untuk hapus gambar)
import { AlertCircle, ImagePlus, Store, Truck, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

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

    // [BARU] Tambahkan field 'payment_proof' di useForm
    const { data, setData, post, processing, errors } = useForm({
        customer_name: user.name || '',
        customer_phone: user.customer_phone || '',
        shipping_address: '',
        delivery_type: 'delivery',
        pickup_time: '',
        payment_method: 'tunai',
        product_id: product_id || null,
        payment_proof: null as File | null, // Default null
    });

    const [isDelivery, setIsDelivery] = useState(true);

    // [BARU] State untuk menyimpan URL gambar sementara (Preview)
    const [preview, setPreview] = useState<string | null>(null);

    // [BARU] Fungsi menangani saat user memilih file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 1. Masukkan file ke state form inertia
            setData('payment_proof', file);

            // 2. Buat URL sementara agar bisa dilihat di layar (Preview)
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    // [BARU] Fungsi untuk menghapus file yang sudah dipilih
    const clearFile = () => {
        setData('payment_proof', null);
        setPreview(null);
    };

    // [BARU] Cleanup memori preview saat komponen ditutup (Penting agar browser tidak berat)
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
            // [PENTING] forceFormData: true WAJIB ADA jika mengirim file lewat Inertia
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pesanan berhasil dibuat!');
            },
            onError: (err) => {
                console.log('Checkout Error:', err);
                toast.error('Gagal memproses pesanan. Periksa inputan Anda.');
            },
        });
    };

    return (
        <PublicLayout>
            <Head title="Checkout Pesanan" />

            <section className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto max-w-6xl px-4">
                    <h1 className="mb-8 flex items-center gap-2 text-3xl font-bold text-gray-900">
                        🛒 Checkout Pesanan
                    </h1>

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
                        {/* ... (BAGIAN KONTAK & PENGIRIMAN SAMA SEPERTI SEBELUMNYA) ... */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* 1. Kontak (Sama) */}
                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-semibold">
                                    1. Informasi Kontak
                                </h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
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
                                            className="mt-1"
                                        />
                                        <InputError
                                            message={errors.customer_name}
                                        />
                                    </div>
                                    <div>
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
                                            className="mt-1"
                                        />
                                        <InputError
                                            message={errors.customer_phone}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Pengiriman (Sama) */}
                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-semibold">
                                    2. Metode Pengiriman
                                </h2>
                                <div className="mb-6 flex gap-4">
                                    <div
                                        onClick={() =>
                                            handleDeliveryTypeChange('delivery')
                                        }
                                        className={`flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${isDelivery ? 'border-primary bg-green-50 text-primary' : 'border-gray-200 hover:border-green-200'}`}
                                    >
                                        <Truck className="h-8 w-8" />{' '}
                                        <span className="font-bold">
                                            Diantar Kurir
                                        </span>
                                    </div>
                                    <div
                                        onClick={() =>
                                            handleDeliveryTypeChange('pickup')
                                        }
                                        className={`flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${!isDelivery ? 'border-primary bg-green-50 text-primary' : 'border-gray-200 hover:border-green-200'}`}
                                    >
                                        <Store className="h-8 w-8" />{' '}
                                        <span className="font-bold">
                                            Ambil di Toko
                                        </span>
                                    </div>
                                </div>
                                {isDelivery ? (
                                    <div className="space-y-4">
                                        <Textarea
                                            rows={3}
                                            value={data.shipping_address}
                                            onChange={(e) =>
                                                setData(
                                                    'shipping_address',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Alamat Lengkap..."
                                        />
                                        <InputError
                                            message={errors.shipping_address}
                                        />
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
                                ) : (
                                    <div className="space-y-4">
                                        <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                                            <p>
                                                Lokasi Toko: Jl. Politeknik No.
                                                1.
                                            </p>
                                        </div>
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
                                )}
                            </div>

                            {/* 3. PEMBAYARAN (DIPERBARUI DENGAN UPLOAD) */}
                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-semibold">
                                    3. Pembayaran
                                </h2>
                                <RadioGroup
                                    value={data.payment_method}
                                    onValueChange={(val) => {
                                        setData('payment_method', val);
                                        // Reset file jika pindah ke Tunai (opsional, UX choice)
                                        if (val === 'tunai') clearFile();
                                    }}
                                    className="space-y-3"
                                >
                                    {/* Opsi Tunai */}
                                    <div
                                        className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 ${data.payment_method === 'tunai' ? 'border-primary bg-green-50' : ''}`}
                                    >
                                        <RadioGroupItem
                                            value="tunai"
                                            id="tunai"
                                        />
                                        <Label
                                            htmlFor="tunai"
                                            className="flex-1 cursor-pointer font-medium"
                                        >
                                            Tunai (COD)
                                        </Label>
                                    </div>

                                    {/* Opsi Transfer DANA / GoPay */}
                                    {['dana', 'gopay'].map((method) => (
                                        <div
                                            key={method}
                                            className={`rounded-lg border p-4 transition-all ${data.payment_method === method ? 'border-primary bg-green-50' : ''}`}
                                        >
                                            <div className="mb-2 flex items-center space-x-3">
                                                <RadioGroupItem
                                                    value={method}
                                                    id={method}
                                                />
                                                <Label
                                                    htmlFor={method}
                                                    className="flex-1 cursor-pointer font-medium capitalize"
                                                >
                                                    Transfer {method}
                                                </Label>
                                            </div>

                                            {/* [BARU] TAMPILKAN AREA UPLOAD HANYA JIKA DIPILIH */}
                                            {data.payment_method === method && (
                                                <div className="mt-3 ml-7 animate-in fade-in slide-in-from-top-2">
                                                    <div className="mb-3 rounded border border-yellow-100 bg-yellow-50 p-3 text-sm text-gray-600">
                                                        <p>
                                                            Nomor Rekening{' '}
                                                            {method.toUpperCase()}
                                                            :
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-900">
                                                            0812-3456-7890
                                                            (PanganKU)
                                                        </p>
                                                    </div>

                                                    {/* Area Input File atau Preview */}
                                                    {!preview ? (
                                                        <div className="mt-2">
                                                            <Label
                                                                htmlFor="proof-upload"
                                                                className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-gray-500 transition-colors hover:border-primary hover:bg-gray-50 hover:text-primary"
                                                            >
                                                                <ImagePlus className="h-8 w-8" />
                                                                <div className="text-center">
                                                                    <span className="text-sm font-medium">
                                                                        Klik
                                                                        untuk
                                                                        Upload
                                                                        Bukti
                                                                    </span>
                                                                    <p className="mt-1 text-xs text-gray-400">
                                                                        JPG, PNG
                                                                        (Max
                                                                        5MB)
                                                                    </p>
                                                                </div>
                                                                {/* Input File Tersembunyi */}
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
                                                        </div>
                                                    ) : (
                                                        // Tampilan Preview
                                                        <div className="relative mt-2 w-fit">
                                                            <img
                                                                src={preview}
                                                                alt="Preview Bukti"
                                                                className="h-48 w-auto rounded-lg border object-cover shadow-sm"
                                                            />
                                                            {/* Tombol Hapus */}
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    clearFile
                                                                }
                                                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white shadow-md transition-colors hover:bg-red-600"
                                                                title="Hapus gambar"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                            <p className="mt-2 flex items-center justify-center gap-1 text-center text-xs font-medium text-green-600">
                                                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                                Bukti siap
                                                                dikirim
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

                        {/* KOLOM KANAN (Ringkasan) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-semibold">
                                    Ringkasan
                                </h2>
                                {/* List Item (Sama) */}
                                <div className="mb-6 max-h-80 space-y-4 overflow-y-auto pr-2">
                                    {items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-3 border-b py-2"
                                        >
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                <img
                                                    src={
                                                        item.product.image
                                                            ? `/storage/${item.product.image}`
                                                            : '/images/placeholder.png'
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col">
                                                <span className="line-clamp-2 text-sm font-medium">
                                                    {item.product.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {item.quantity} x{' '}
                                                    {formatRupiah(
                                                        item.product.price,
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold">
                                                {formatRupiah(
                                                    item.product.price *
                                                        item.quantity,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 border-t pt-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{formatRupiah(total)}</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-6 w-full bg-primary py-6 text-lg"
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
