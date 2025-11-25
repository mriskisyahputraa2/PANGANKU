import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// [BARU] Import komponen Select
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Komponen Pecahan
import CategoryFormDialog from '@/components/admin/categories/category-form-dialog';
import CategoryTable from '@/components/admin/categories/category-table';
import DeleteDialog from '@/components/admin/products/delete-dialog';

export default function CategoryIndex({ categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    // [BARU] State per_page diambil dari filters controller (default 10)
    const [perPage, setPerPage] = useState(String(filters.per_page || '10'));

    const isInitialMount = useRef(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // 1. Handle Search (Debounce)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(
                '/admin/categories',
                { search, per_page: perPage },
                { preserveState: true, replace: true },
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    // 2. [BARU] Handle Per Page Change (Langsung reload)
    const handlePerPageChange = (val) => {
        setPerPage(val);
        router.get(
            '/admin/categories',
            { search, per_page: val },
            { preserveState: true, replace: true },
        );
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsFormOpen(true);
    };
    const handleEdit = (cat) => {
        setSelectedCategory(cat);
        setIsFormOpen(true);
    };
    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/categories/${deleteId}`, {
                onSuccess: () => toast.success('Kategori berhasil dihapus'),
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Kategori' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kategori" />

            <Card className="flex h-full flex-1 flex-col border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm">
                <CardHeader className="px-4 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-xl">
                                Kategori Produk
                            </CardTitle>
                            <CardDescription>
                                Kelompokkan produk agar mudah dicari pembeli.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={handleCreate}
                            className="w-full bg-primary sm:w-auto"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                            Kategori
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col px-4 sm:px-6">
                    {/* AREA FILTER & SEARCH (Dibuat Responsif Sejajar) */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search Bar */}
                        <div className="relative w-full sm:max-w-sm">
                            <Input
                                placeholder="Cari kategori..."
                                className="bg-white pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>

                        {/* [BARU] Dropdown Per Page */}
                        <div className="flex items-center gap-2">
                            <Select
                                value={perPage}
                                onValueChange={handlePerPageChange}
                            >
                                <SelectTrigger className="w-[80px] shrink-0 bg-white sm:w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="5">5 Data</SelectItem>
                                    <SelectItem value="10">10 Data</SelectItem>
                                    <SelectItem value="20">20 Data</SelectItem>
                                    <SelectItem value="50">50 Data</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabel */}
                    <CategoryTable
                        categories={categories}
                        onEdit={handleEdit}
                        onDelete={setDeleteId}
                    />
                </CardContent>

                {/* Pagination Footer */}
                {categories.data.length > 0 && (
                    <CardFooter className="border-t px-4 py-4 sm:px-6">
                        <div className="flex w-full flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Menampilkan <strong>{categories.from}</strong> -{' '}
                                <strong>{categories.to}</strong> dari{' '}
                                <strong>{categories.total}</strong> data
                            </span>
                            <div className="flex justify-center gap-1">
                                {categories.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveState
                                        >
                                            <Button
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                className="h-8 min-w-[2rem]"
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Link>
                                    ) : (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            size="sm"
                                            disabled
                                            className="h-8 min-w-[2rem] opacity-50"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    </CardFooter>
                )}
            </Card>

            <CategoryFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                category={selectedCategory}
            />
            <DeleteDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}
