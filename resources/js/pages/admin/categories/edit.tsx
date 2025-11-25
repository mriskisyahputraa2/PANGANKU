import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';

// 1. Terima props 'category' dari Controller
export default function Edit({ category }) {
    // 2. Sesuaikan breadcrumbs
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Kategori', href: '/admin/categories' },
        { title: 'Edit Kategori' },
    ];

    // 3. Gunakan 'patch' untuk update dan isi 'useForm' dengan data props
    const { data, setData, patch, processing, errors } = useForm({
        name: category.name || '',
    });

    // 4. Sesuaikan handleSubmit untuk update
    const handleSubmit = (e) => {
        e.preventDefault();
        // Gunakan method PATCH/PUT dan URL dengan ID
        patch(`/admin/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kategori" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/admin/categories">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                {/* 5. Sesuaikan Judul dan Deskripsi Halaman */}
                                <h1 className="text-xl font-bold">
                                    Edit Kategori
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Mengubah data untuk kategori:{' '}
                                    {category.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="order-last lg:order-first lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detail Kategori</CardTitle>
                                    <CardDescription>
                                        Perbarui nama untuk kategori ini.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* 6. Form input sama dengan 'create' */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nama Kategori *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Contoh: Daging Sapi Segar"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Kolom Kanan: Kartu Informasi (Sama) */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader className="flex-row items-center gap-2 space-y-0 text-blue-500">
                                    <Info className="h-5 w-5" />
                                    <CardTitle>Informasi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                                        <p>
                                            <strong>Nama Kategori</strong> akan
                                            digunakan sebagai filter utama
                                            pencarian produk di halaman toko.
                                        </p>
                                        <p>
                                            Pastikan nama yang dimasukkan unik
                                            dan belum pernah digunakan
                                            sebelumnya.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        {/* 7. Sesuaikan Link Batal dan Teks Tombol Simpan */}
                        <Link href="/admin/categories">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
