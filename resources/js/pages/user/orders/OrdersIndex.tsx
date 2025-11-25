import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import PublicLayout from '@/layouts/public-layout';
import { formatRupiah } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { Eye, ShoppingBag } from 'lucide-react';

// Helper Warna Status
const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
        menunggu_pembayaran:
            'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100',
        menunggu_verifikasi:
            'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-100',
        diproses: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100',
        dikirim:
            'bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-100',
        siap_diambil:
            'bg-cyan-100 text-cyan-800 border-cyan-300 hover:bg-cyan-100',
        selesai:
            'bg-green-100 text-green-800 border-green-300 hover:bg-green-100',
        dibatalkan: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-100',
    };

    const label = status.replace(/_/g, ' ').toUpperCase();
    const className =
        styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';

    return (
        <Badge className={className} variant="outline">
            {label}
        </Badge>
    );
};

// Definisi Tipe untuk Props Pagination
interface PaginatedOrders {
    data: any[];
    links: any[];
    // properti pagination lain jika perlu
}

export default function OrdersIndex({ orders }: { orders: PaginatedOrders }) {
    // ## PERBAIKAN DI SINI ##
    // Kita ambil array pesanan dari 'orders.data'
    const orderList = orders.data || [];

    return (
        <PublicLayout>
            <Head title="Riwayat Pesanan - PanganKU" />
            <section className="min-h-screen bg-secondary/30 py-16">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-foreground">
                            📦 Riwayat Pesanan
                        </h1>
                        <Link href="/products">
                            <Button variant="outline">Belanja Lagi</Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Transaksi Anda</CardTitle>
                            <CardDescription>
                                Pantau status pesanan ayam segar Anda di sini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Cek panjang array dari orderList, bukan orders */}
                            {orderList.length === 0 ? (
                                <div className="py-12 text-center">
                                    <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                                        Belum ada pesanan
                                    </h3>
                                    <p className="mb-6 text-muted-foreground">
                                        Yuk, mulai belanja ayam segar
                                        berkualitas sekarang!
                                    </p>
                                    <Link href="/products">
                                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                                            Mulai Belanja
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>No. Order</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">
                                                    Aksi
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Mapping dari orderList (orders.data) */}
                                            {orderList.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">
                                                        {order.order_number}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.created_at}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatRupiah(
                                                            order.total_amount,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            order.status,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Link
                                                            href={`/orders/${order.id}`}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-primary"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Detail
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* (Opsional) Jika ingin menampilkan navigasi halaman */}
                            {/* <div className="mt-4"> ... Pagination Links ... </div> */}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
