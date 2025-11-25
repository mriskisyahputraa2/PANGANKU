import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Eye, ShoppingBag, Truck } from 'lucide-react';
import StatusBadge from './status-badge';

export default function OrderTable({ orders }) {
    if (!orders?.data?.length) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground">
                <ShoppingBag className="h-12 w-12 opacity-20" />
                <p>Belum ada pesanan masuk</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden rounded-md border shadow-sm">
            <div className="w-full overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader className="bg-gray-50 text-xs uppercase">
                        <TableRow>
                            {/* [TAMBAHAN] Kolom Nomor */}
                            <TableHead className="w-12 text-center">
                                No.
                            </TableHead>

                            <TableHead className="w-[140px]">
                                No. Order
                            </TableHead>
                            <TableHead>Pelanggan</TableHead>
                            <TableHead className="w-[150px]">Total</TableHead>
                            <TableHead className="w-[120px]">Metode</TableHead>
                            <TableHead className="w-[140px] text-center">
                                Status
                            </TableHead>
                            <TableHead className="w-[100px] text-right">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.map((order, index) => (
                            <TableRow key={order.id} className="group">
                                {/* [TAMBAHAN] Sel Data Nomor */}
                                <TableCell className="text-center text-xs font-medium text-muted-foreground">
                                    {orders.from + index}
                                </TableCell>

                                <TableCell className="font-mono font-medium text-primary">
                                    {order.order_number}
                                    <div className="mt-0.5 font-sans text-[10px] text-muted-foreground">
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-gray-900">
                                        {order.customer_name}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        {order.delivery_type === 'delivery' ? (
                                            <Truck className="h-3 w-3" />
                                        ) : (
                                            <ShoppingBag className="h-3 w-3" />
                                        )}
                                        {order.delivery_type === 'delivery'
                                            ? 'Delivery'
                                            : 'Pickup'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {formatRupiah(order.total_amount)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground capitalize">
                                    {order.payment_method}
                                </TableCell>
                                <TableCell className="text-center">
                                    <StatusBadge status={order.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/orders/${order.id}`}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 group-hover:bg-primary/10 group-hover:text-primary"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
