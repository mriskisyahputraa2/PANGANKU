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
import { Calendar, Eye } from 'lucide-react';
import StatusBadge from './status-badge';

export default function OrderTable({ orders }) {
    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableHead className="w-12 pl-6 text-center font-semibold text-gray-700">
                            No.
                        </TableHead>
                        <TableHead className="w-[180px] font-semibold text-gray-700">
                            No. Order
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            Tanggal
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            Total Bayar
                        </TableHead>
                        <TableHead className="text-center font-semibold text-gray-700">
                            Status
                        </TableHead>
                        <TableHead className="pr-6 text-right font-semibold text-gray-700">
                            Aksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    {orders.data.map((order, index) => (
                        <TableRow
                            key={order.id}
                            className="transition-colors hover:bg-gray-50"
                        >
                            <TableCell className="pl-6 text-center text-xs font-medium text-muted-foreground">
                                {(orders.from || 1) + index}
                            </TableCell>
                            <TableCell className="font-mono font-bold text-primary">
                                #{order.order_number}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">
                                        {order.created_at}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 font-medium text-gray-900">
                                    {formatRupiah(order.total_amount)}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                                <Link href={`/orders/${order.id}`}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-xs hover:border-primary hover:text-primary"
                                    >
                                        Lihat Detail{' '}
                                        <Eye className="ml-1.5 h-3 w-3" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
