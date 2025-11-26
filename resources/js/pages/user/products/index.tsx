import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronsUpDown, Filter, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Import Komponen
import SharedPagination from '@/components/shared/pagination';
import ProductCard from '@/components/user/products/product-card';
import ProductFilter from '@/components/user/products/product-filter';

// --- Tipe Data ---
interface Product {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    stock: number;
    description: string;
    category: { name: string; slug: string };
    production_time?: string;
}
interface Category {
    id: number;
    name: string;
    slug: string;
}
interface PageProps {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
    };
    categories: Category[];
    filters: { search?: string; category?: string };
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Index({ products, categories, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const isInitialMount = useRef(true);

    // Debounce Search
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(
                '/products',
                {
                    search: search,
                    category: filters.category,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleCategory = (slug: string | null) => {
        router.get(
            '/products',
            { search, category: slug },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <PublicLayout transparentHeader={true}>
            <Head title="Katalog Produk" />

            <section className="min-h-screen bg-gray-50 py-12 pt-32 lg:pt-40">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="flex flex-col gap-10 lg:flex-row">
                        {/* === SIDEBAR FILTER (DESKTOP) === */}
                        <aside className="hidden w-1/4 shrink-0 lg:block">
                            <div className="sticky top-28">
                                {/* Panggil Komponen Filter */}
                                <ProductFilter
                                    search={search}
                                    setSearch={setSearch}
                                    categories={categories}
                                    selectedCategory={filters.category}
                                    onCategoryChange={handleCategory}
                                />
                            </div>
                        </aside>

                        {/* === KONTEN UTAMA === */}
                        <main className="flex-1">
                            <div className="mb-8 flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Link
                                        href="/"
                                        className="hover:text-primary"
                                    >
                                        Beranda
                                    </Link>
                                    <span>/</span>
                                    <span className="font-medium text-foreground">
                                        Katalog
                                    </span>
                                </div>
                                <h1 className="font-display text-3xl font-bold text-gray-900">
                                    Katalog Produk
                                </h1>

                                {/* Filter Mobile (Collapsible) */}
                                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:hidden">
                                    <Collapsible
                                        open={isFilterOpen}
                                        onOpenChange={setIsFilterOpen}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 font-bold text-gray-900">
                                                <Filter className="h-4 w-4" />{' '}
                                                Filter & Pencarian
                                            </span>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-9 p-0"
                                                >
                                                    <ChevronsUpDown className="h-4 w-4" />
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="mt-4 border-t border-gray-100 pt-4 animate-in fade-in slide-in-from-top-2">
                                            {/* Panggil Komponen Filter */}
                                            <ProductFilter
                                                search={search}
                                                setSearch={setSearch}
                                                categories={categories}
                                                selectedCategory={
                                                    filters.category
                                                }
                                                onCategoryChange={
                                                    handleCategory
                                                }
                                            />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Menampilkan{' '}
                                        <strong>
                                            {products.from || 0}-
                                            {products.to || 0}
                                        </strong>{' '}
                                        dari <strong>{products.total}</strong>{' '}
                                        produk
                                    </p>
                                    {(filters.search || filters.category) && (
                                        <Link
                                            href="/products"
                                            className="flex items-center gap-1 text-sm text-red-500 hover:underline"
                                        >
                                            <X className="h-3 w-3" /> Reset
                                            Filter
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* GRID PRODUK */}
                            {products.data.length > 0 ? (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                >
                                    {products.data.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            variants={fadeUp}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed bg-white py-20 text-center">
                                    <p className="text-gray-500">
                                        Produk tidak ditemukan.
                                    </p>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setSearch('');
                                            handleCategory(null);
                                        }}
                                    >
                                        Reset Filter
                                    </Button>
                                </div>
                            )}

                            {/* PAGINATION */}
                            <div className="mt-12">
                                <SharedPagination
                                    links={products.links}
                                    current_page={products.current_page}
                                    last_page={products.last_page}
                                />
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
