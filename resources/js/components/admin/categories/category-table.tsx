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
import { Ellipsis, FilePen, Folder, Trash2 } from 'lucide-react';

export default function CategoryTable({ categories, onEdit, onDelete }) {
    if (!categories || categories.data.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground">
                <Folder className="h-12 w-12 opacity-20" />
                <p>Belum ada kategori</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden rounded-md border shadow-sm">
            <div className="w-full overflow-x-auto">
                {/* Min-width agar tidak gepeng di HP */}
                <Table className="min-w-[600px]">
                    <TableHeader className="bg-gray-50 text-xs uppercase">
                        <TableRow>
                            <TableHead className="w-12 text-center">
                                No.
                            </TableHead>
                            <TableHead>Nama Kategori</TableHead>
                            <TableHead className="w-[200px]">Slug</TableHead>
                            <TableHead className="w-[80px] text-right">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.data.map((category, index) => (
                            <TableRow key={category.id}>
                                <TableCell className="text-center text-muted-foreground">
                                    {categories.from + index}
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {category.name}
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                                        {category.slug}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* GANTI TOMBOL WARNA DENGAN DROPDOWN MENU */}
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
                                            <DropdownMenuItem
                                                onClick={() => onEdit(category)}
                                            >
                                                <FilePen className="mr-2 h-4 w-4" />{' '}
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() =>
                                                    onDelete(category.id)
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
