import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

// Import Komponen Pecahan
import ImageCard from './partials/image-card';
import InfoCard from './partials/info-card';
import PricingCard from './partials/pricing-card';

export default function ProductForm({ categories, product = null }) {
    const isEditMode = product !== null;
    const title = isEditMode
        ? `Edit Produk: ${product.name}`
        : 'Tambah Produk Baru';

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Produk', href: '/admin/products' },
        { title: isEditMode ? 'Edit' : 'Tambah' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: product?.name || '',
        category_id: product?.category_id ? String(product.category_id) : '',
        description: product?.description || '',
        price: product?.price || '',
        hpp: product?.hpp || '',
        stock: product?.stock || '',
        production_time: product?.production_time || '',
        image: null,
    });

    // URL Gambar Awal
    const initialImage =
        isEditMode && product?.image ? `/storage/${product.image}` : null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            router.post(`/admin/products/${product.id}`, {
                _method: 'patch',
                ...data,
            });
        } else {
            post('/admin/products', { onSuccess: () => reset() });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className="w-full space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/products">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900">
                                {isEditMode ? 'Edit Produk' : 'Tambah Produk'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {isEditMode
                                    ? 'Perbarui informasi produk.'
                                    : 'Masukkan informasi produk ayam segar baru.'}
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    {/* KOLOM KIRI (Info & Harga) - Mobile: Order 2, Desktop: Order 1 */}
                    <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
                        {/* Panggil Komponen InfoCard */}
                        <InfoCard
                            data={data}
                            setData={setData}
                            errors={errors}
                            categories={categories}
                        />

                        {/* Panggil Komponen PricingCard */}
                        <PricingCard
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>

                    {/* KOLOM KANAN (Gambar) - Mobile: Order 1, Desktop: Order 2 */}
                    <div className="order-1 space-y-6 lg:order-2">
                        {/* Panggil Komponen ImageCard */}
                        <ImageCard
                            data={data}
                            setData={setData}
                            errors={errors}
                            isEditMode={isEditMode}
                            initialImage={initialImage}
                        />
                    </div>

                    {/* TOMBOL AKSI (Bawah) - Order 3 */}
                    <div className="order-3 col-span-full mt-4">
                        <div className="flex flex-col justify-end gap-3 sm:flex-row">
                            <Link
                                href="/admin/products"
                                className="order-2 w-full sm:order-1 sm:w-auto"
                            >
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full sm:w-auto"
                                >
                                    Batal & Kembali
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                size="lg"
                                className="order-1 w-full shadow-md sm:order-2 sm:w-auto"
                                disabled={processing}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing
                                    ? 'Menyimpan...'
                                    : isEditMode
                                      ? 'Simpan Perubahan'
                                      : 'Simpan Produk'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
