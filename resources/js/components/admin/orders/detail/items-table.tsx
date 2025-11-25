import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';

export default function ItemsTable({ items, total }) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            item.product?.image
                                                ? `/storage/${item.product.image}`
                                                : '/images/placeholder.png'
                                        }
                                        alt={item.product?.name}
                                        className="h-10 w-10 rounded bg-gray-100 object-cover"
                                    />
                                    <span className="font-medium text-gray-900">
                                        {item.product?.name || 'Produk Dihapus'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {formatRupiah(item.price)}
                            </TableCell>
                            <TableCell className="text-center">
                                {item.quantity}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                {formatRupiah(item.price * item.quantity)}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow className="bg-gray-50 font-bold">
                        <TableCell
                            colSpan={3}
                            className="text-right text-muted-foreground"
                        >
                            Total Pesanan
                        </TableCell>
                        <TableCell className="text-right text-lg text-primary">
                            {formatRupiah(total)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
