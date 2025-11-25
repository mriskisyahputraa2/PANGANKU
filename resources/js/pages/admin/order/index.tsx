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
import { Head, Link } from '@inertiajs/react';

// Import Components
import OrderFilters from '@/components/admin/orders/order-filters';
import OrderTable from '@/components/admin/orders/order-table';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Pesanan' },
];

export default function OrderIndex({ orders, filters }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pesanan" />

            <Card className="flex h-full flex-1 flex-col border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm">
                <CardHeader className="px-4 sm:px-6">
                    <div className="flex flex-col gap-2">
                        <CardTitle className="text-xl">
                            Daftar Pesanan
                        </CardTitle>
                        <CardDescription>
                            Pantau pesanan masuk, verifikasi pembayaran, dan
                            proses pengiriman.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col px-4 sm:px-6">
                    <OrderFilters filters={filters} />
                    <OrderTable orders={orders} />
                </CardContent>

                {/* Pagination */}
                {orders.data.length > 0 && (
                    <CardFooter className="border-t px-4 py-4 sm:px-6">
                        <div className="flex w-full flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Menampilkan <strong>{orders.from}</strong> -{' '}
                                <strong>{orders.to}</strong> dari{' '}
                                <strong>{orders.total}</strong> pesanan
                            </span>
                            <div className="flex justify-center gap-1">
                                {orders.links.map((link, i) =>
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
        </AppLayout>
    );
}
