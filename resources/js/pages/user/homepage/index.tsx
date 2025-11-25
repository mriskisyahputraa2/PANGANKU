import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import PublicLayout from '@/layouts/public-layout';
import { formatRupiah } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle,
    Leaf,
    MessageSquareQuote,
    Plus,
    ShieldCheck,
    Star,
    Truck,
    Users,
} from 'lucide-react';

// Ganti path ini agar sesuai dengan lokasi gambar Anda
import heroImage2 from '~/assets/images/pexels-damir-26596092.jpg';
import heroImage from '~/assets/images/pexels-davegarcia-32840078.jpg';
import heroImage3 from '~/assets/images/pexels-gamerxtc-17064389.jpg';

// Menggunakan placeholder sementara
// const heroImage = '/images/placeholder/hero-meat.jpg';
// const heroImage2 = '/images/placeholder/about-us.jpg';
// const heroImage3 = '/images/placeholder/default-product.png';

// Gambar placeholder (tidak berubah)
const aboutImage = '/images/placeholder/about-us.jpg';
const defaultProductImage = '/images/placeholder/default-product.png';
const avatar1 = '/images/placeholder/avatar-1.jpg';
const avatar2 = '/images/placeholder/avatar-2.jpg';
const avatar3 = '/images/placeholder/avatar-3.jpg';

// Konfigurasi animasi (tidak berubah)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// Data statis (tidak berubah)
const faqs = [
    {
        q: 'Apakah produk di PanganKU dijamin Halal?',
        a: 'Ya, semua produk daging dan ayam kami berasal dari rumah potong hewan bersertifikat Halal MUI dan diproses secara higienis sesuai syariat.',
    },
    {
        q: 'Bagaimana cara memesan produk?',
        a: 'Anda bisa mendaftar/login, pilih produk yang diinginkan dari katalog kami, masukkan ke keranjang, lalu lanjutkan ke proses checkout untuk memilih metode pembayaran dan pengiriman.',
    },
    {
        q: 'Area mana saja yang dijangkau pengiriman?',
        a: 'Saat ini kami melayani pengiriman untuk seluruh area Kota Lhokseumawe. Estimasi waktu pengiriman akan ditampilkan saat checkout.',
    },
    {
        q: 'Bagaimana jika produk yang diterima tidak sesuai?',
        a: 'Kami memberikan jaminan kualitas. Jika produk yang Anda terima rusak atau tidak sesuai, silakan hubungi customer service kami maksimal 1x24 jam setelah penerimaan barang untuk proses penggantian atau refund.',
    },
];

const testimonials = [
    {
        name: 'Ibu Rina - Lhokseumawe',
        role: 'Pelanggan Setia',
        quote: 'Daging sapi di PanganKU selalu segar dan kualitasnya premium. Pengirimannya juga cepat, sangat membantu untuk stok masakan di rumah.',
        avatar: avatar1,
    },
    {
        name: 'Chef Budi - Restoran Aroma',
        role: 'Mitra Bisnis',
        quote: 'Sebagai chef, kualitas bahan baku adalah segalanya. PanganKU konsisten memberikan daging dengan potongan yang presisi dan kualitas terbaik.',
        avatar: avatar2,
    },
    {
        name: 'Bapak Ahmad - Kuta Blang',
        role: 'Pelanggan Baru',
        quote: 'Baru pertama kali coba pesan ayam kampung di sini, ternyata benar-benar fresh dan rasanya beda. Pasti pesan lagi!',
        avatar: avatar3,
    },
];

// Helper inisial (tidak berubah)
const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

// Menerima props 'featuredProducts' dari controller
export default function Homepage({ featuredProducts = [] }) {
    return (
        <PublicLayout>
            <Head title="Beranda - PanganKU Kualitas Premium" />

            {/* 1. Hero Section (PUTIH - bg-card) */}
            <section className="relative overflow-hidden bg-card pt-40 pb-32">
                <div className="relative z-10 container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        {/* Kolom Teks */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
                                Kualitas Premium,{' '}
                                <span className="text-primary">
                                    Kesegaran Terjamin.
                                </span>
                            </h1>
                            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:text-2xl">
                                Rasakan kesegaran ayam alami tanpa bahan
                                pengawet, siap olah untuk hidangan sehat
                                keluarga setiap hari.
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                                <Link
                                    href="/products"
                                    className="shine-effect inline-block rounded-lg bg-primary px-8 py-3 text-center font-bold text-primary-foreground transition duration-300 hover:bg-primary/90 hover:shadow-lg"
                                >
                                    Belanja Sekarang
                                </Link>
                                <Link
                                    href="/categories"
                                    className="inline-block rounded-lg border-2 border-primary px-8 py-3 text-center font-bold text-primary transition duration-300 hover:bg-primary hover:text-primary-foreground"
                                >
                                    Lihat Kategori
                                </Link>
                            </div>
                        </motion.div>

                        {/* Kolom Gambar Carousel */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <Carousel
                                className="w-full"
                                plugins={[
                                    Autoplay({
                                        delay: 3000,
                                    }),
                                ]}
                            >
                                <CarouselContent>
                                    <CarouselItem>
                                        <img
                                            src={heroImage}
                                            alt="Ayam Segar PanganKU 1"
                                            className="h-auto w-full rounded-2xl object-cover shadow-xl"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </CarouselItem>
                                    <CarouselItem>
                                        <img
                                            src={heroImage2}
                                            alt="Ayam Segar PanganKU 2"
                                            className="h-auto w-full rounded-2xl object-cover shadow-xl"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </CarouselItem>
                                    <CarouselItem>
                                        <img
                                            src={heroImage3}
                                            alt="Ayam Segar PanganKU 3"
                                            className="h-auto w-full rounded-2xl object-cover shadow-xl"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </motion.div>
                    </div>

                    {/* Stats / Social Proof */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5, staggerChildren: 0.2 }}
                        className="mt-20 grid grid-cols-2 gap-8 text-center md:grid-cols-4"
                    >
                        <motion.div variants={itemVariants}>
                            <Users className="mx-auto h-10 w-10 text-primary" />
                            <p className="mt-2 text-2xl font-bold text-foreground">
                                1,200+
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Pelanggan Puas
                            </p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Leaf className="mx-auto h-10 w-10 text-primary" />
                            <p className="mt-2 text-2xl font-bold text-foreground">
                                100%
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Alami & Segar
                            </p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
                            <p className="mt-2 text-2xl font-bold text-foreground">
                                Halal
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tersertifikasi MUI
                            </p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Star className="mx-auto h-10 w-10 text-primary" />
                            <p className="mt-2 text-2xl font-bold text-foreground">
                                4.9/5
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Rating Kualitas
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Seksi "Tentang Kami" (ABU SOFT - bg-background) */}
            <section className="bg-background py-24">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                            className="overflow-hidden rounded-2xl border border-border shadow-lg"
                        >
                            <img
                                src={heroImage}
                                alt="Daging Segar PanganKU"
                                className="h-full w-full object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h2 className="text-3xl font-bold text-foreground">
                                Pilihan Terbaik untuk Dapur Anda
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Di PanganKU, kami percaya bahwa hidangan lezat
                                berawal dari bahan baku terbaik...
                            </p>
                            <ul className="mt-8 space-y-6">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                                        <ShieldCheck className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            100% Halal & Higienis
                                        </h3>
                                        <p className="mt-1 text-muted-foreground">
                                            Proses pemotongan...
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                                        <CheckCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Kualitas Premium
                                        </h3>
                                        <p className="mt-1 text-muted-foreground">
                                            Dipilih dari sumber terbaik...
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                                        <Truck className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Pengiriman Cepat & Aman
                                        </h3>
                                        <p className="mt-1 text-muted-foreground">
                                            Armada pendingin kami...
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Produk Unggulan (PUTIH - bg-card) */}
            <section className="bg-card py-24">
                <div className="container mx-auto max-w-7xl px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold text-foreground"
                    >
                        Produk Terlaris Kami
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mx-auto mt-4 max-w-2xl text-muted-foreground"
                    >
                        Temukan potongan daging ayam segar...
                    </motion.p>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="mt-12 grid grid-cols-1 place-items-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {featuredProducts.slice(0, 3).map((product: any) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                className="group relative w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-lg transition-all duration-300 hover:shadow-2xl"
                            >
                                <Link href={`/products/${product.slug}`}>
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={
                                                product.image ||
                                                defaultProductImage
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) =>
                                                (e.currentTarget.src =
                                                    defaultProductImage)
                                            }
                                        />
                                        <Badge className="absolute top-4 left-4">
                                            {product.category}
                                        </Badge>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="line-clamp-2 h-14 text-lg font-bold text-foreground group-hover:text-primary">
                                            {product.name}
                                        </h3>
                                        <div className="mt-2 pt-2">
                                            <p className="text-lg font-bold text-primary">
                                                {formatRupiah(product.price)}
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    {' '}
                                                    / kg
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <Button
                                    size="icon"
                                    className="absolute right-4 bottom-4 translate-y-2 rounded-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                                    aria-label="Tambah ke keranjang"
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-12"
                    >
                        <Link href="/products">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                                Lihat Semua Produk{' '}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 4. Seksi Testimoni (ABU SOFT - bg-background) */}
            <section className="bg-background py-24">
                <div className="container mx-auto max-w-7xl px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold text-foreground"
                    >
                        Apa Kata Pelanggan Kami?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mx-auto mt-4 max-w-2xl text-muted-foreground"
                    >
                        Pengalaman nyata dari mereka...
                    </motion.p>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex h-full flex-col rounded-xl border border-border bg-card p-8 text-left shadow-sm" // Kartu Putih
                            >
                                <MessageSquareQuote className="h-8 w-8 text-primary" />
                                <p className="mt-4 flex-1 text-muted-foreground italic">
                                    "{testimonial.quote}"
                                </p>
                                <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                        />
                                        <AvatarFallback>
                                            {getInitials(testimonial.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-foreground">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 5. Seksi FAQ (PUTIH - bg-card) */}
            <section className="bg-card py-24">
                <div className="container mx-auto max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-foreground">
                            Pertanyaan Umum (FAQ)
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Temukan jawaban cepat untuk pertanyaan Anda tentang
                            PanganKU.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12"
                    >
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index + 1}`}
                                    className="border-b border-border"
                                >
                                    <AccordionTrigger className="text-left text-lg font-semibold text-primary hover:no-underline">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </section>

            {/* 6. Seksi Final Call to Action (HIJAU - bg-primary) */}
            <section className="bg-primary py-20 text-primary-foreground">
                <div className="container mx-auto max-w-7xl px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-extrabold"
                    >
                        Siap Memasak Hidangan Terbaik?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mx-auto mt-4 max-w-2xl text-lg opacity-90"
                    >
                        Pesan sekarang dan rasakan perbedaan kualitas produk
                        segar premium dari PanganKU...
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-8"
                    >
                        <Link
                            href="/products"
                            className="shine-effect inline-block transform rounded-lg bg-card px-8 py-3 text-center font-bold text-primary shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-white/90" // Tombol Putih
                        >
                            Mulai Belanja Sekarang
                        </Link>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
