import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import PublicLayout from '@/layouts/public-layout';
import { formatRupiah } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Clock,
    Leaf,
    MessageSquareQuote,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Star,
    Truck,
    Zap,
} from 'lucide-react';
import { toast } from 'sonner';

// --- DATA DUMMY ---
const defaultProductImage = '/images/placeholder/default-product.png';

const categories = [
    {
        name: 'Ayam Utuh',
        icon: '🐓',
        href: '/products?search=utuh',
        color: 'bg-orange-100 text-orange-600',
    },
    {
        name: 'Filet Dada',
        icon: '🥩',
        href: '/products?search=dada',
        color: 'bg-red-100 text-red-600',
    },
    {
        name: 'Paha Bawah',
        icon: '🍗',
        href: '/products?search=paha',
        color: 'bg-yellow-100 text-yellow-600',
    },
    {
        name: 'Sayap',
        icon: '🦅',
        href: '/products?search=sayap',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        name: 'Jeroan',
        icon: '🥣',
        href: '/products?search=jeroan',
        color: 'bg-green-100 text-green-600',
    },
    {
        name: 'Olahan',
        icon: '🍱',
        href: '/products?search=olahan',
        color: 'bg-purple-100 text-purple-600',
    },
];

const testimonials = [
    {
        name: 'Ibu Rina',
        role: 'Ibu Rumah Tangga',
        quote: 'Ayamnya benar-benar segar, beda banget sama yang di pasar biasa. Pengiriman cepat!',
        rating: 5,
    },
    {
        name: 'Pak Budi',
        role: 'Pemilik Katering',
        quote: 'Potongannya rapi, timbangannya pas. PanganKU jadi andalan katering saya.',
        rating: 5,
    },
    {
        name: 'Chef Junaidi',
        role: 'Head Chef',
        quote: 'Teksturnya juicy dan tidak berbau. Sangat direkomendasikan untuk resto.',
        rating: 5,
    },
    {
        name: 'Kak Sarah',
        role: 'Anak Kos',
        quote: 'Praktis banget buat stok di kulkas. Kemasannya rapi dan bersih.',
        rating: 4,
    },
];

const faqs = [
    {
        q: 'Apakah ayam di PanganKU Halal?',
        a: 'Ya, 100% Halal. Ayam kami dipotong dengan syariat Islam di RPH bersertifikat MUI.',
    },
    {
        q: 'Berapa lama pengiriman?',
        a: 'Pesan sebelum jam 10 pagi, dikirim hari yang sama. Selebihnya dikirim esok pagi.',
    },
    {
        q: 'Bagaimana jika ayam rusak?',
        a: 'Garansi Ganti Baru! Cukup kirim foto/video saat unboxing ke WA Admin.',
    },
];

// --- VARIAN ANIMASI ---
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

const fadeLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
const fadeRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const popUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', bounce: 0.4 },
    },
};

export default function Homepage({ featuredProducts = [] }) {
    const handleAddToCart = (productId: number) => {
        router.post(
            '/cart/add',
            { product_id: productId, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Berhasil masuk keranjang!'),
            },
        );
    };

    return (
        <PublicLayout transparentHeader={true}>
            <Head title="PanganKU - Ayam Segar Langsung dari Peternakan" />

            {/* ===================================================================================== */}
            {/* 1. HERO SECTION */}
            {/* ===================================================================================== */}
            <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                {/* Background Pattern */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-white to-transparent"></div>

                <div className="relative z-10 container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        {/* KIRI */}
                        <motion.div
                            className="text-center lg:col-span-7 lg:text-left"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeUp}>
                                <Badge className="mb-6 border-orange-100 bg-orange-50 px-4 py-1.5 text-sm text-orange-600 shadow-sm hover:bg-orange-100">
                                    <Zap className="mr-1.5 h-3.5 w-3.5 animate-pulse fill-orange-500 text-orange-500" />
                                    Pengiriman Tercepat se-Lhokseumawe
                                </Badge>
                            </motion.div>

                            {/* [FONT DISPLAY] */}
                            <motion.h1
                                variants={fadeUp}
                                className="mb-6 font-display text-5xl leading-[1.1] font-bold tracking-tight text-gray-900 md:text-7xl"
                            >
                                Ayam Segar, <br className="hidden md:block" />
                                <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                                    Sehat & Halal.
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={fadeUp}
                                className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-600 lg:mx-0"
                            >
                                Langsung dari peternakan pilihan ke dapur Anda.
                                Tanpa pengawet, dipotong subuh, dikirim pagi.
                                Jaminan kualitas terbaik untuk keluarga.
                            </motion.p>

                            <motion.div
                                variants={fadeUp}
                                className="mb-12 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
                            >
                                <Link href="/products">
                                    <Button
                                        size="lg"
                                        className="h-14 w-full rounded-full bg-primary px-10 text-lg font-bold text-white shadow-xl shadow-primary/25 transition-transform hover:scale-105 hover:bg-primary/90 sm:w-auto"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />{' '}
                                        Belanja Sekarang
                                    </Button>
                                </Link>
                                <Link href="#faq">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-14 w-full rounded-full border-2 px-10 text-lg font-bold text-gray-600 hover:border-primary/30 hover:bg-gray-50 hover:text-primary sm:w-auto"
                                    >
                                        Pelajari Dulu
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Kategori - TAMPIL SEMUA */}
                            <motion.div
                                variants={fadeUp}
                                className="border-t border-gray-100 pt-8"
                            >
                                <p className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Kategori Populer
                                </p>
                                <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                                    {categories.map((cat, idx) => (
                                        <Link
                                            key={idx}
                                            href={cat.href}
                                            className="group flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 transition-all duration-300 hover:border-primary hover:shadow-md"
                                        >
                                            <span className="text-lg">
                                                {cat.icon}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-700 group-hover:text-primary">
                                                {cat.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* KANAN: Gambar Floating */}
                        <motion.div
                            className="relative hidden lg:col-span-5 lg:block"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="relative overflow-hidden rounded-[2.5rem] border-[8px] border-white bg-white shadow-2xl"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=1974&auto=format&fit=crop"
                                    alt="Ayam Segar"
                                    className="h-auto w-full object-cover"
                                />
                                <div className="animate-bounce-slow absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/90 p-3 pr-6 shadow-lg backdrop-blur-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
                                        <Leaf className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">
                                            Kualitas
                                        </p>
                                        <p className="font-display text-lg font-bold text-gray-900">
                                            Grade A+
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="absolute -top-10 -right-10 -z-10 h-[400px] w-[400px] animate-pulse rounded-full bg-primary/20 blur-3xl"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===================================================================================== */}
            {/* 2. FITUR UNGGULAN */}
            {/* ===================================================================================== */}
            <section className="relative bg-white py-20">
                <div className="container mx-auto max-w-7xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 gap-8 md:grid-cols-3"
                    >
                        {[
                            {
                                icon: ShieldCheck,
                                color: 'blue',
                                title: '100% Halal & Higienis',
                                desc: 'Sertifikasi Halal MUI. Proses pemotongan sesuai syariat dan standar kebersihan tinggi.',
                            },
                            {
                                icon: Clock,
                                color: 'green',
                                title: 'Jaminan Segar',
                                desc: 'Ayam dipotong subuh hari, langsung dikemas dan dikirim pagi harinya. Bukan stok beku lama.',
                            },
                            {
                                icon: Truck,
                                color: 'orange',
                                title: 'Pengiriman Cepat',
                                desc: 'Armada kami siap mengantar pesanan Anda dengan aman dan tepat waktu.',
                            },
                        ].map((feature, i) => (
                            <motion.div key={i} variants={popUp}>
                                <Card className="group h-full border-none bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                    <CardContent className="p-8 text-center">
                                        <div
                                            className={`h-20 w-20 bg-${feature.color}-50 text-${feature.color}-600 mx-auto mb-6 flex items-center justify-center rounded-3xl transition-transform duration-300 group-hover:scale-110`}
                                        >
                                            <feature.icon className="h-10 w-10" />
                                        </div>
                                        {/* [FONT DISPLAY] */}
                                        <h3 className="mb-3 font-display text-xl font-bold text-gray-900">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-gray-500">
                                            {feature.desc}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===================================================================================== */}
            {/* 3. PRODUK TERLARIS (FIX FOTO & HARGA) */}
            {/* ===================================================================================== */}
            <section className="relative overflow-hidden bg-gray-50 py-24">
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-white to-gray-50"></div>
                <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>

                <div className="relative z-10 container mx-auto max-w-7xl px-6">
                    <div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeRight}
                        >
                            {/* [FONT DISPLAY] */}
                            <h2 className="font-display text-4xl font-bold text-gray-900">
                                Produk Pilihan
                            </h2>
                            <p className="mt-2 text-lg text-gray-600">
                                Favorit keluarga Indonesia minggu ini.
                            </p>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeLeft}
                        >
                            <Link href="/products">
                                <Button
                                    variant="ghost"
                                    className="hidden rounded-full px-6 text-primary hover:bg-primary/10 md:flex"
                                >
                                    Lihat Semua{' '}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product: any) => (
                                <motion.div
                                    key={product.id}
                                    variants={fadeUp}
                                    whileHover={{ y: -10 }}
                                    className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-2xl"
                                >
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="relative block aspect-square w-full overflow-hidden bg-gray-50"
                                    >
                                        {/* [PERBAIKAN FOTO] Pakai object-cover agar mengisi kotak persegi */}
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

                                        {product.stock <= 5 && (
                                            <Badge
                                                variant="destructive"
                                                className="absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs shadow-md"
                                            >
                                                Sisa {product.stock}
                                            </Badge>
                                        )}

                                        <Button
                                            size="icon"
                                            className="absolute right-4 bottom-4 z-10 h-10 w-10 translate-y-10 rounded-full bg-white text-primary opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-primary hover:text-white"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(product.id);
                                            }}
                                        >
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </Link>

                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="mb-1 text-xs font-bold tracking-wider text-orange-500 uppercase">
                                            {product.category?.name || 'Umum'}
                                        </div>
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="mb-auto"
                                        >
                                            {/* [FONT DISPLAY] */}
                                            <h3 className="line-clamp-1 font-display text-lg font-bold text-gray-900 transition-colors hover:text-primary">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                            {/* [PERBAIKAN HARGA] Hanya tampilkan harga asli, hapus harga coret */}
                                            <span className="text-xl font-extrabold text-gray-900">
                                                {formatRupiah(product.price)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full rounded-3xl border-2 border-dashed bg-white/50 py-20 text-center text-gray-400">
                                Belum ada produk unggulan.
                            </div>
                        )}
                    </motion.div>

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/products">
                            <Button className="w-full rounded-full">
                                Lihat Semua Produk
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===================================================================================== */}
            {/* 4. TESTIMONI */}
            {/* ===================================================================================== */}
            <section className="overflow-hidden border-t border-gray-100 bg-white py-24">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <Badge
                            variant="outline"
                            className="mb-4 rounded-full border-primary bg-primary/5 px-4 py-1 text-primary"
                        >
                            Kata Mereka
                        </Badge>
                        {/* [FONT DISPLAY] */}
                        <h2 className="font-display text-4xl font-bold text-gray-900">
                            Cerita Pelanggan Setia
                        </h2>
                    </div>

                    <div className="mx-auto max-w-6xl">
                        <Carousel
                            plugins={[Autoplay({ delay: 4000 })]}
                            className="w-full"
                        >
                            <CarouselContent>
                                {testimonials.map((testi, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="p-4 md:basis-1/2 lg:basis-1/3"
                                    >
                                        <div className="relative h-full rounded-[2rem] bg-gray-50 p-8 transition-colors duration-300 hover:bg-primary/5">
                                            <MessageSquareQuote className="absolute top-6 right-6 h-12 w-12 rotate-12 text-gray-200" />
                                            <div className="mb-6 flex gap-1 text-yellow-400">
                                                {[...Array(testi.rating)].map(
                                                    (_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="h-5 w-5 fill-current"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                            <p className="mb-8 text-lg leading-relaxed text-gray-700 italic">
                                                "{testi.quote}"
                                            </p>
                                            <div className="flex items-center gap-4 border-t border-gray-200/50 pt-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-green-300 text-xl font-bold text-white shadow-md">
                                                    {testi.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        {testi.name}
                                                    </h4>
                                                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                                        {testi.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="mt-8 flex justify-center gap-2">
                                <CarouselPrevious className="static h-12 w-12 translate-y-0 border-2 border-gray-200 hover:border-primary hover:text-primary" />
                                <CarouselNext className="static h-12 w-12 translate-y-0 border-2 border-gray-200 hover:border-primary hover:text-primary" />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </section>

            {/* ===================================================================================== */}
            {/* 5. FAQ */}
            {/* ===================================================================================== */}
            <section id="faq" className="bg-gray-50 py-24">
                <div className="container mx-auto max-w-3xl px-6">
                    {/* [FONT DISPLAY] */}
                    <h2 className="mb-12 text-center font-display text-3xl font-bold text-gray-900">
                        Pertanyaan Umum
                    </h2>
                    <div className="space-y-4">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, idx) => (
                                <AccordionItem
                                    key={idx}
                                    value={`item-${idx}`}
                                    className="mb-4 rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition-all data-[state=open]:shadow-md"
                                >
                                    <AccordionTrigger className="py-4 text-left text-base font-semibold text-gray-800 hover:text-primary hover:no-underline">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4 leading-relaxed text-gray-600">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* ===================================================================================== */}
            {/* 6. FOOTER CTA */}
            {/* ===================================================================================== */}
            <section className="relative flex items-center justify-center overflow-hidden bg-gray-900 py-32">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

                <div className="relative z-10 container mx-auto max-w-4xl px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* [FONT DISPLAY] */}
                        <h2 className="mb-8 font-display text-4xl leading-tight font-black text-white md:text-7xl">
                            Hidangan Lezat <br /> Dimulai Dari Sini.
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-gray-300 md:text-xl">
                            Jangan kompromi soal kualitas makanan keluarga.
                            Pesan ayam segar PanganKU sekarang dan rasakan
                            bedanya.
                        </p>
                        <div className="flex flex-col justify-center gap-6 sm:flex-row">
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="w-full rounded-full border-0 bg-primary px-12 py-8 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-primary/50 sm:w-auto"
                                >
                                    Mulai Belanja
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full rounded-full border-white/30 bg-transparent px-12 py-8 text-lg font-bold text-white backdrop-blur-sm hover:bg-white hover:text-gray-900 sm:w-auto"
                                >
                                    Daftar Akun
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
