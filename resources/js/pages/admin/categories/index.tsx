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
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
// Ganti AdminLayout dengan layout yang Anda gunakan
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Ellipsis,
    FilePen,
    PlusCircle,
    Search,
    Tags, // Mengganti ikon CalendarDays dengan Tags
    Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Sesuaikan breadcrumbs untuk halaman kategori
const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Kategori' },
];

export default function Index({ categories, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        // TAMBAHKAN BARIS INI UNTUK DEBUGGING
        console.log('Flash message received:', flash);

        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Debounce untuk fungsi pencarian
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(
                '/admin/categories', // Ganti URL ke route kategori
                { search, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, filters.per_page]);

    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/categories', // Ganti URL ke route kategori
            { search: filters.search, per_page: perPage },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/categories/${deleteId}`, {
                // Ganti URL ke route kategori
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kategori" />
            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Daftar Kategori Produk</CardTitle>
                        <Link href="/admin/categories/create">
                            {' '}
                            {/* Ganti URL ke route kategori */}
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Kategori
                            </Button>
                        </Link>
                    </div>
                    <CardDescription>
                        Kelola semua kategori produk untuk PanganKU di sini.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative w-full max-w-xs">
                            <Input
                                type="search"
                                placeholder="Cari nama kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <Select
                            onValueChange={handlePerPageChange}
                            defaultValue={String(filters.per_page || '5')}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 Data</SelectItem>
                                <SelectItem value="10">10 Data</SelectItem>
                                <SelectItem value="20">20 Data</SelectItem>
                                <SelectItem value="50">50 Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 overflow-auto rounded-md border">
                        <Table>
                            <TableHeader className="font-bold uppercase">
                                <TableRow>
                                    <TableHead className="w-10">No.</TableHead>
                                    <TableHead>Nama Kategori</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead className="w-20 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.length > 0 ? (
                                    categories.data.map((category, index) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                {categories.from + index}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell className="">
                                                {category.slug}
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
                                                                href={`/admin/categories/${category.id}/edit`}
                                                            >
                                                                {' '}
                                                                {/* Ganti URL */}
                                                                <FilePen className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    category.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-full p-8 text-center"
                                        >
                                            {' '}
                                            {/* Sesuaikan colSpan */}
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <Tags className="h-16 w-16 text-gray-300 dark:text-gray-700" />{' '}
                                                {/* Ganti Ikon */}
                                                <h3 className="text-xl font-bold">
                                                    Belum Ada Kategori
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Buat kategori produk baru
                                                    untuk memulai mengelompokkan
                                                    produk Anda.
                                                </p>
                                                <Link href="/admin/categories/create">
                                                    {' '}
                                                    {/* Ganti URL */}
                                                    <Button className="mt-2">
                                                        <PlusCircle className="mr-2 h-4 w-4" />
                                                        Buat Kategori Pertama
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {categories.data.length > 0 && (
                    <CardFooter className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan{' '}
                            <span className="font-semibold">
                                {categories.from || 0}
                            </span>{' '}
                            -{' '}
                            <span className="font-semibold">
                                {categories.to || 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold">
                                {categories.total || 0}
                            </span>{' '}
                            hasil
                        </div>
                        <Pagination>
                            <PaginationContent>
                                {categories.links.map((link, index) =>
                                    link.label.includes('Previous') ? (
                                        <PaginationPrevious
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                        />
                                    ) : link.label.includes('Next') ? (
                                        <PaginationNext
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                        />
                                    ) : (
                                        <PaginationLink
                                            key={index}
                                            href={link.url}
                                            isActive={link.active}
                                            preserveScroll
                                            preserveState
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    ),
                                )}
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                )}
            </Card>

            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data kategori secara
                            permanen. Produk yang terkait mungkin akan
                            terpengaruh.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            variant="destructive"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
