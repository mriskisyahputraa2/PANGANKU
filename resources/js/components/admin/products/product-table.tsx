import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Ellipsis, FilePen, Package, Trash2 } from 'lucide-react';

export default function ProductTable({ products, onDelete }) {
    if (!products || !products.data) return null;

    if (products.data.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground">
                <Package className="h-12 w-12 opacity-20" />
                <p>Data produk tidak ditemukan</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden rounded-md border shadow-sm">
            {/* [KUNCI RESPONSIVE] overflow-x-auto mengizinkan scroll horizontal */}
            <div className="w-full overflow-x-auto">
                {/* [KUNCI RESPONSIVE] min-w-[800px] memaksa tabel tetap lebar (tidak gepeng) */}
                <Table className="min-w-[800px]">
                    <TableHeader className="bg-gray-50 text-xs uppercase">
                        <TableRow>
                            <TableHead className="w-12 text-center">
                                No.
                            </TableHead>
                            <TableHead className="w-20 text-center">
                                Gambar
                            </TableHead>
                            <TableHead className="min-w-[150px]">
                                Nama Produk
                            </TableHead>
                            <TableHead className="w-[120px]">
                                Kategori
                            </TableHead>
                            <TableHead className="w-[120px]">Harga</TableHead>
                            <TableHead className="w-[100px] text-center">
                                Stok
                            </TableHead>
                            <TableHead className="w-16 text-right">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.map((product, index) => (
                            <TableRow key={product.id}>
                                <TableCell className="text-center text-xs sm:text-sm">
                                    {products.from + index}
                                </TableCell>
                                <TableCell>
                                    <div className="mx-auto h-10 w-10 overflow-hidden rounded-md border bg-gray-100">
                                        <img
                                            src={
                                                product.image
                                                    ? `/storage/${product.image}`
                                                    : '/images/placeholder.png'
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                            onError={(e) =>
                                                (e.currentTarget.src =
                                                    '/images/placeholder.png')
                                            }
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-900">
                                            {product.name}
                                        </span>
                                        {product.production_time && (
                                            <span className="text-[10px] text-muted-foreground">
                                                🕒 {product.production_time}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium whitespace-nowrap text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                                        {product.category?.name ||
                                            'Uncategorized'}
                                    </span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {formatRupiah(product.price)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {product.stock <= 5 ? (
                                        <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                                            {product.stock} (Menipis)
                                        </span>
                                    ) : (
                                        <span className="text-sm">
                                            {product.stock}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                            >
                                                <Ellipsis className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                >
                                                    <FilePen className="mr-2 h-4 w-4" />{' '}
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() =>
                                                    onDelete(product.id)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
