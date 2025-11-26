import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Package, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

// Import Komponen Pecahan (Pastikan file-file ini sudah ada dari langkah sebelumnya)
import OrderEmpty from '@/components/user/orders/order-empty';
import OrderPagination from '@/components/user/orders/order-pagination';
import OrderTable from '@/components/user/orders/order-table';
import OrderTabs from '@/components/user/orders/order-tabs';

export default function OrdersIndex({
    orders,
    currentStatus = 'all',
}: {
    orders: any;
    currentStatus?: string;
}) {
    const [activeTab, setActiveTab] = useState(currentStatus);

    useEffect(() => {
        setActiveTab(currentStatus);
    }, [currentStatus]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.get(
            '/orders',
            { status: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const hasData = orders.data && orders.data.length > 0;

    return (
        // [FIX 1] Aktifkan Transparent Header agar konsisten dengan Homepage/Produk
        <PublicLayout transparentHeader={true}>
            <Head title="Riwayat Pesanan" />

            {/* [FIX 2] Tambahkan padding-top besar (pt-32) agar tidak tertutup Header Fixed */}
            <section className="relative min-h-screen bg-gray-50 py-12 pt-32 lg:pt-40">
                {/* Dekorasi Background Halus (Opsional, agar header terbaca jelas) */}
                <div className="absolute top-0 left-0 -z-10 h-80 w-full bg-gradient-to-b from-white to-gray-50"></div>

                <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                    {/* Header Halaman */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            {/* [FIX 3] Gunakan Font Display */}
                            <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 md:text-4xl">
                                <Package className="h-8 w-8 text-primary" />
                                Riwayat Pesanan
                            </h1>
                            <p className="mt-2 text-base text-muted-foreground">
                                Kelola dan pantau status belanjaan Anda di sini.
                            </p>
                        </div>
                        <Link href="/products">
                            <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Belanja Lagi
                            </Button>
                        </Link>
                    </div>

                    {/* Filter Tabs (Komponen Pecahan) */}
                    <OrderTabs
                        currentStatus={activeTab}
                        onTabChange={handleTabChange}
                    />

                    {/* Konten Utama */}
                    <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                        <CardHeader className="border-b bg-white px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="font-display text-lg">
                                        Daftar Transaksi
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-sm">
                                        Menampilkan {orders.from || 0} -{' '}
                                        {orders.to || 0} dari{' '}
                                        {orders.total || 0} pesanan
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {hasData ? (
                                // Tampilkan Tabel jika ada data
                                <OrderTable orders={orders} />
                            ) : (
                                // Tampilkan Empty State jika kosong
                                <OrderEmpty
                                    currentStatus={currentStatus}
                                    onReset={() => handleTabChange('all')}
                                />
                            )}
                        </CardContent>

                        {/* Footer Pagination */}
                        {hasData && <OrderPagination orders={orders} />}
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
