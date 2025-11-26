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

// Import Komponen Pecahan
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
        <PublicLayout transparentHeader={true}>
            <Head title="Riwayat Pesanan" />

            <section className="min-h-screen bg-gray-50/50 py-8 sm:py-12">
                <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                    {/* Header Halaman */}
                    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                <Package className="h-7 w-7 text-primary" />
                                Riwayat Pesanan
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Kelola dan pantau status belanjaan Anda di sini.
                            </p>
                        </div>
                        <Link href="/products" className="w-full sm:w-auto">
                            <Button className="w-full shadow-sm sm:w-auto">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Belanja Lagi
                            </Button>
                        </Link>
                    </div>

                    {/* Filter Tabs */}
                    <OrderTabs
                        currentStatus={activeTab}
                        onTabChange={handleTabChange}
                    />

                    {/* Konten Utama */}
                    <Card className="overflow-hidden border-none shadow-md">
                        <CardHeader className="border-b bg-white px-4 py-4 sm:px-6">
                            <CardTitle className="text-lg">
                                Daftar Transaksi
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Menampilkan {orders.from || 0} -{' '}
                                {orders.to || 0} dari {orders.total || 0}{' '}
                                pesanan
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-0">
                            {hasData ? (
                                <OrderTable orders={orders} />
                            ) : (
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
