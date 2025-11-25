import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';

export default function OrderSummary({ order }) {
    const subtotal = order.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    return (
        <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="border-b bg-gray-50/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    Rincian Pesanan{' '}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                        ({order.items.length} Item)
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                {/* WRAPPER SCROLLABLE */}
                <div className="relative max-h-[400px] overflow-y-auto">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                            <TableRow className="hover:bg-transparent">
                                {/* [BARU] Kolom Nomor */}
                                <TableHead className="w-[60px] pl-6 text-center">
                                    No.
                                </TableHead>

                                <TableHead className="w-[250px]">
                                    Produk
                                </TableHead>
                                <TableHead className="text-right">
                                    Harga
                                </TableHead>
                                <TableHead className="text-center">
                                    Qty
                                </TableHead>
                                <TableHead className="pr-6 text-right">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Tambahkan parameter index */}
                            {order.items.map((item, index) => (
                                <TableRow key={item.id}>
                                    {/* [BARU] Tampilkan Nomor Urut */}
                                    <TableCell className="pl-6 text-center text-xs font-medium text-muted-foreground">
                                        {index + 1}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-gray-100">
                                                <img
                                                    src={
                                                        item.product?.image
                                                            ? `/storage/${item.product.image}`
                                                            : '/images/placeholder.png'
                                                    }
                                                    alt={item.product?.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) =>
                                                        (e.currentTarget.src =
                                                            '/images/placeholder.png')
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <span className="line-clamp-2 text-sm font-medium text-gray-900">
                                                    {item.product?.name ||
                                                        'Produk Dihapus'}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        {formatRupiah(item.price)}
                                    </TableCell>
                                    <TableCell className="text-center text-sm text-gray-500">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="pr-6 text-right text-sm font-medium">
                                        {formatRupiah(
                                            item.price * item.quantity,
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* BAGIAN TOTAL */}
                <div className="relative z-20 space-y-3 border-t bg-gray-50/50 p-6">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal Produk</span>
                        <span>{formatRupiah(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Biaya Layanan</span>
                        <span className="font-medium text-green-600">
                            Gratis
                        </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t pt-3">
                        <span className="font-bold text-gray-900">
                            Total Pembayaran
                        </span>
                        <span className="text-xl font-bold text-primary">
                            {formatRupiah(order.total_amount)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
