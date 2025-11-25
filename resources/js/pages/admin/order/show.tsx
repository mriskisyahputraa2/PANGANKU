import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout'; // <-- Menggunakan AppLayout
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

// Tipe data (ambil dari model Anda)
interface Product {
    name: string;
}
interface User {
    name: string;
    email: string;
}
interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}
interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string; // <-- Menggunakan 'status'
    payment_status: string;
    shipping_address: string;
    customer_name: string;
    customer_phone: string;
    payment_method: string;
    tracking_number?: string;
    user: User;
    items: OrderItem[];
}

// Helper untuk format Rupiah
const formatRupiah = (number: number) => {
    if (isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Helper untuk warna status (konsisten dengan index)
const getStatusBadge = (status: string) => {
    let color = '';
    const safeStatus = status || 'default';
    // ... (logika switch/case status seperti di index.tsx) ...
    switch (safeStatus) {
        case 'pending':
        case 'menunggu_pembayaran':
            color = 'bg-yellow-100 text-yellow-800 border-yellow-300';
            break;
        case 'processing':
        case 'diproses':
            color = 'bg-blue-100 text-blue-800 border-blue-300';
            break;
        case 'shipped':
        case 'dikirim':
            color = 'bg-indigo-100 text-indigo-800 border-indigo-300';
            break;
        case 'completed':
        case 'selesai':
            color = 'bg-green-100 text-green-800 border-green-300';
            break;
        case 'cancelled':
        case 'dibatalkan':
            color = 'bg-red-100 text-red-800 border-red-300';
            break;
        default:
            color = 'bg-gray-100 text-gray-800 border-gray-300';
            break;
    }
    return (
        <Badge
            variant="outline"
            className={`capitalize ${color} border text-xs`}
        >
            {safeStatus.replace(/_/g, ' ')}
        </Badge>
    );
};

export default function OrderShow({ order }: { order: Order }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: order.status ?? 'pending', // <-- Menggunakan 'status'
        tracking_number: order.tracking_number ?? '',
        // Kita juga perlu payment_status sesuai controller Anda (jika ada)
        // Jika tidak ada di controller, hapus baris ini
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Menggunakan URL manual (TANPA ZIGGY)
        patch(`/admin/orders/${order.id}`, {
            onSuccess: () => toast.success('Status pesanan diperbarui!'),
            onError: () => toast.error('Gagal memperbarui status.'),
        });
    };

    const isShipped = data.status === 'shipped' || data.status === 'dikirim';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pesanan', href: '/admin/orders' },
                { title: 'Detail' },
            ]}
        >
            <Head title={`Detail Pesanan #${order.order_number}`} />

            <div className="mb-4">
                <Link href="/admin/orders">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Pesanan
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Kolom Detail Item & Pelanggan */}
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Detail Pesanan: #{order.order_number}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="mb-3 text-lg font-semibold">
                                Item Pesanan
                            </h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Kuantitas</TableHead>
                                        <TableHead>Harga Satuan</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {item.product.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell>
                                                {formatRupiah(item.price)}
                                            </TableCell>
                                            <TableCell>
                                                {formatRupiah(
                                                    item.price * item.quantity,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4 border-t pt-4 text-right">
                                <p className="text-lg font-bold">
                                    Total Pesanan:{' '}
                                    {formatRupiah(order.total_amount)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Informasi Pembeli & Pengiriman
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold">
                                        Nama Pembeli:
                                    </h4>
                                    <p>{order.customer_name}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Email:</h4>
                                    <p>{order.user.email}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Telepon:</h4>
                                    <p>{order.customer_phone}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        Metode Bayar:
                                    </h4>
                                    <p className="capitalize">
                                        {order.payment_method}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <h4 className="font-semibold">
                                        Alamat Pengiriman:
                                    </h4>
                                    <p>{order.shipping_address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Update Status */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Status Pesanan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <h4 className="font-semibold">
                                    Status Saat Ini:
                                </h4>
                                {getStatusBadge(order.status)}
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="status">Ubah Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData('status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="menunggu_pembayaran">
                                                Menunggu Pembayaran
                                            </SelectItem>
                                            <SelectItem value="diproses">
                                                Diproses
                                            </SelectItem>
                                            <SelectItem value="dikirim">
                                                Dikirim
                                            </SelectItem>
                                            <SelectItem value="selesai">
                                                Selesai
                                            </SelectItem>
                                            <SelectItem value="dibatalkan">
                                                Dibatalkan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.status}
                                        className="mt-2"
                                    />
                                </div>

                                {isShipped && (
                                    <div>
                                        <Label htmlFor="tracking_number">
                                            Nomor Resi
                                        </Label>
                                        <Input
                                            id="tracking_number"
                                            type="text"
                                            placeholder="Masukkan nomor resi"
                                            value={data.tracking_number}
                                            onChange={(e) =>
                                                setData(
                                                    'tracking_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.tracking_number}
                                            className="mt-2"
                                        />
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing
                                        ? 'Memperbarui...'
                                        : 'Simpan Perubahan'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
