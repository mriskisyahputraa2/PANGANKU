import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import AppLayout from '@/layouts/app-layout'; // Pastikan path layout admin Anda benar
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Ellipsis,
    Eye,
    Package,
    Search,
    Trash2, // Pastikan Trash2 diimpor
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
// import Pagination from '@/components/pagination'; // Jika Anda punya komponen pagination

// --- KONFIGURASI KHUSUS PESANAN ---
const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Pesanan' },
];

// Helper untuk format Rupiah
const formatRupiah = (number: number) => {
    if (isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Helper untuk warna status (disesuaikan dengan Tailwind/Shadcn)
const getStatusBadge = (status: string) => {
    // Terima string
    let color = '';
    // Handle jika status undefined/null (sebagai penjaga)
    const safeStatus = status || 'default';

    switch (safeStatus) {
        case 'pending': // Status dari 'payment_status'
        case 'menunggu_pembayaran': // Status dari 'status'
            color = 'bg-yellow-100 text-yellow-800 border-yellow-300';
            break;
        case 'processing': // Status lama
        case 'diproses': // Status baru
            color = 'bg-blue-100 text-blue-800 border-blue-300';
            break;
        case 'shipped': // Status lama
        case 'dikirim': // Status baru
            color = 'bg-indigo-100 text-indigo-800 border-indigo-300';
            break;
        case 'completed': // Status lama
        case 'selesai': // Status baru
            color = 'bg-green-100 text-green-800 border-green-300';
            break;
        case 'cancelled': // Status lama
        case 'dibatalkan': // Status baru
            color = 'bg-red-100 text-red-800 border-red-300';
            break;
        default:
            color = 'bg-gray-100 text-gray-800 border-gray-300';
            break;
    }
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}
        >
            {/* Ganti _ dengan spasi untuk tampilan */}
            {safeStatus.replace(/_/g, ' ')}
        </span>
    );
};

// --- KOMPONEN UTAMA ---
export default function Index({ orders, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [deleteId, setDeleteId] = useState(null); // Ini untuk dialog "Batalkan Pesanan"
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (flash && flash.success) toast.success(flash.success as string);
        if (flash && flash.error) toast.error(flash.error as string);
    }, [flash]);

    // Efek untuk Pencarian dan Filter
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(
                '/admin/orders', // Pastikan route ini benar
                { search, status, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, status, filters.per_page]); // Tambahkan status ke dependency array

    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/orders', // Pastikan route ini benar
            { search: filters.search, status, per_page: perPage },
            { preserveState: true, replace: true },
        );
    };

    // Aksi untuk "Batalkan Pesanan"
    const handleDelete = () => {
        if (deleteId) {
            // Kita tidak menghapus, tapi update status menjadi 'dibatalkan'
            router.patch(
                `/admin/orders/${deleteId}`,
                {
                    status: 'dibatalkan',
                    payment_status: 'failed', // Atau 'refunded' jika perlu
                },
                {
                    onFinish: () => setDeleteId(null),
                    preserveScroll: true,
                    onSuccess: () =>
                        toast.success('Pesanan berhasil dibatalkan.'),
                    onError: () => toast.error('Gagal membatalkan pesanan.'),
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pesanan" />
            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Daftar Pesanan</CardTitle>
                    </div>
                    <CardDescription>
                        Kelola semua pesanan PanganKU dan perbarui status
                        pengiriman.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Input Pencarian Kode Pesanan */}
                            <div className="relative w-full max-w-xs">
                                <Input
                                    type="search"
                                    placeholder="Cari kode pesanan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>

                            {/* Select Filter Status Pesanan */}
                            <Select
                                onValueChange={setStatus}
                                defaultValue={status}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
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
                        </div>

                        {/* Select Per Page (Jumlah Data) */}
                        <Select
                            onValueChange={handlePerPageChange}
                            defaultValue={String(filters.per_page || '5')}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 Data</SelectItem>
                                <SelectItem value="15">15 Data</SelectItem>
                                <SelectItem value="30">30 Data</SelectItem>
                                <SelectItem value="50">50 Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 overflow-auto rounded-md border">
                        <Table>
                            <TableHeader className="font-bold uppercase">
                                <TableRow>
                                    <TableHead className="w-10">No.</TableHead>
                                    <TableHead>Kode Pesanan</TableHead>
                                    <TableHead>Nama Pembeli</TableHead>
                                    <TableHead>Tanggal Pesanan</TableHead>
                                    <TableHead>Total Pembayaran</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-20 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.length > 0 ? (
                                    orders.data.map((order, index) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                {orders.from + index}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {order.order_number}
                                            </TableCell>
                                            <TableCell>
                                                {order.user?.name ||
                                                    order.customer_name ||
                                                    'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell className="font-bold">
                                                {formatRupiah(
                                                    order.total_amount,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {/* ## INI ADALAH PERBAIKAN UTAMA ## */}
                                                {getStatusBadge(order.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <Ellipsis className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                // Link tanpa Ziggy
                                                                href={`/admin/orders/${order.id}`}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Lihat Detail
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {/* Aksi Pembatalan (Opsional) */}
                                                        {order.status !==
                                                            'dibatalkan' &&
                                                            order.status !==
                                                                'selesai' && (
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:text-red-600"
                                                                    onClick={() =>
                                                                        setDeleteId(
                                                                            order.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Batalkan
                                                                    Pesanan
                                                                </DropdownMenuItem>
                                                            )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-full p-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <Package className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                                                <h3 className="text-xl font-bold">
                                                    Belum Ada Pesanan Masuk
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Tidak ada pesanan yang cocok
                                                    dengan filter Anda.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>

                {/* Footer untuk Pagination */}
                {orders.data.length > 0 && (
                    <CardFooter className="flex justify-center p-4">
                        {/* Tambahkan komponen Pagination Anda di sini jika ada, misalnya: */}
                        {/* <Pagination links={orders.links} /> */}
                    </CardFooter>
                )}
            </Card>

            {/* AlertDialog untuk Pembatalan Pesanan */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Batalkan Pesanan Ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Pesanan ini akan diubah statusnya menjadi
                            **Dibatalkan**. Tindakan ini tidak dapat diurungkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            variant="destructive"
                        >
                            Ya, Batalkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
