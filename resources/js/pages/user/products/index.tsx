import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react'; // Tambah Icon Clock

// --- Tipe Data (Tambahkan production_time) ---
interface Product {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    category: { name: string };
    production_time?: string; // [BARU]
}
interface Category {
    id: number;
    name: string;
    slug: string;
}
interface PageProps {
    products: {
        data: Product[];
        links: { [key: string]: string | null };
        meta: {
            current_page: number;
            last_page: number;
            links: { url: string | null; label: string; active: boolean }[];
            total: number;
        };
    };
    categories: Category[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};
const defaultProductImage = '/images/placeholder/default-product.png';

export default function Index({ products, categories }: PageProps) {
    return (
        <PublicLayout>
            <Head title="Katalog Produk - PanganKU" />

            {/* Hero Section */}
            <section className="bg-card pt-40 pb-32">
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-4 text-5xl font-extrabold text-foreground"
                    >
                        Katalog Produk{' '}
                        <span className="text-primary">PanganKU</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mx-auto max-w-2xl text-lg text-muted-foreground"
                    >
                        Pilih bahan pangan segar terbaik dengan kualitas
                        premium, dikirim langsung ke rumah Anda.
                    </motion.p>
                </div>
            </section>

            {/* Produk Section */}
            <section className="bg-background py-16">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="w-full">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg text-muted-foreground">
                                Menampilkan {products?.data?.length || 0} dari{' '}
                                {products?.meta?.total || 0} produk
                            </h3>
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                >
                                    <ArrowLeft className="mr-2 h-5 w-5" />{' '}
                                    Kembali ke Beranda
                                </Button>
                            </Link>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        >
                            {(products?.data?.length || 0) === 0 ? (
                                <div className="col-span-full py-20 text-center text-lg text-muted-foreground">
                                    Produk tidak ditemukan.
                                </div>
                            ) : (
                                products.data.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={itemVariants}
                                        className="group relative w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-lg transition-all duration-300 hover:shadow-2xl"
                                    >
                                        <Link
                                            href={`/products/${product.slug}`}
                                        >
                                            <div className="relative aspect-video overflow-hidden">
                                                <img
                                                    src={
                                                        product.image
                                                            ? `/storage/${product.image}`
                                                            : defaultProductImage
                                                    }
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) =>
                                                        (e.currentTarget.src =
                                                            defaultProductImage)
                                                    }
                                                />

                                                {/* [BARU] Badge Jam Potong */}
                                                {product.production_time && (
                                                    <Badge className="absolute top-3 left-3 flex items-center gap-1 bg-green-600 shadow-md hover:bg-green-700">
                                                        <Clock className="h-3 w-3" />{' '}
                                                        {
                                                            product.production_time
                                                        }
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                {/* Kategori kecil di atas nama */}
                                                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                                    {product.category?.name ||
                                                        'Umum'}
                                                </span>

                                                <h3 className="mt-1 line-clamp-2 h-14 text-lg font-bold text-foreground group-hover:text-primary">
                                                    {product.name}
                                                </h3>

                                                <div className="mt-2 flex items-end justify-between pt-2">
                                                    <p className="text-lg font-bold text-primary">
                                                        {new Intl.NumberFormat(
                                                            'id-ID',
                                                            {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                                minimumFractionDigits: 0,
                                                            },
                                                        ).format(
                                                            Number(
                                                                product.price,
                                                            ),
                                                        )}
                                                        {/* Hapus /kg agar netral, atau ganti '/pax' */}
                                                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                                                            / pack
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>

                        {/* Paginasi (Tidak berubah) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-16"
                        >
                            <Pagination>
                                <PaginationContent>
                                    {products?.meta?.links?.map(
                                        (link, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    href={link.url || ''}
                                                    isActive={link.active}
                                                    preserveScroll
                                                    preserveState
                                                    className={
                                                        link.url
                                                            ? ''
                                                            : 'pointer-events-none text-muted-foreground'
                                                    }
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            </PaginationItem>
                                        ),
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </motion.div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
