import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import DeleteDialog from '@/components/admin/products/delete-dialog';
import ProductFilters from '@/components/admin/products/product-filters';
import ProductTable from '@/components/admin/products/product-table';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Produk' },
];

interface IndexProps {
    products: any;
    filters: any;
    categories: any[];
}

export default function Index({ products, filters, categories }: IndexProps) {
    const { flash } = usePage().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/products/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Produk" />

            {/* Card tanpa border di mobile agar terlihat menyatu dengan background */}
            <Card className="flex h-full flex-1 flex-col border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm">
                <CardHeader className="px-4 sm:px-6">
                    {/* Layout Header: Flex Column di HP, Row di Desktop */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-xl">
                                Daftar Produk
                            </CardTitle>
                            <CardDescription>
                                Kelola inventaris, harga, dan stok.
                            </CardDescription>
                        </div>

                        {/* Tombol Tambah Full Width di HP */}
                        <Link
                            href="/admin/products/create"
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full bg-primary sm:w-auto">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Produk
                            </Button>
                        </Link>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col px-4 sm:px-6">
                    <ProductFilters filters={filters} categories={categories} />

                    <ProductTable products={products} onDelete={setDeleteId} />
                </CardContent>

                {products.data.length > 0 && (
                    <CardFooter className="border-t px-4 py-4 sm:px-6">
                        <div className="flex w-full flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Menampilkan <strong>{products.from}</strong> -{' '}
                                <strong>{products.to}</strong> dari{' '}
                                <strong>{products.total}</strong> data
                            </span>

                            <div className="flex justify-center gap-1">
                                {products.links.map((link: any, i: number) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveState
                                            preserveScroll
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

            <DeleteDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}
