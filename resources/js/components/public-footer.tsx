import { Link } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';
import AppLogo from './app-logo';

// Tautan (tidak berubah)
const publicNavItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Daftar Produk', href: '/products' },
    { title: 'Kontak', href: '/contact' },
    { title: 'Login', href: '/login' },
];

const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Twitter, href: '#', name: 'Twitter' },
];

export function PublicFooter() {
    return (
        // PERUBAHAN FOOTER: DARI GELAP -> CERAH (bg-card)
        <footer className="border-t border-border bg-card text-muted-foreground">
            <div className="container mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
                    {/* Kolom 1: Logo & Deskripsi */}
                    <div className="md:col-span-12 lg:col-span-4">
                        <Link href="/">
                            <AppLogo className="h-10 w-auto" />
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Penyedia produk pangan hewani segar berkualitas
                            premium. Daging, ayam, dan ikan terbaik langsung
                            diantar ke dapur Anda.
                        </p>
                    </div>

                    {/* Kolom 2: Tautan Cepat */}
                    <div className="md:col-span-4 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-foreground">
                            Toko
                        </h3>
                        <ul className="mt-4 space-y-2">
                            {publicNavItems.map((item) => (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Hubungi Kami */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <h3 className="text-lg font-semibold text-foreground">
                            Hubungi Kami
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-start">
                                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                <span className="ml-3 text-sm text-muted-foreground">
                                    Jl. Medan - Banda Aceh, Lhokseumawe, Aceh
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                                <span className="ml-3 text-sm text-muted-foreground">
                                    (+645) 834-4569
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                                <span className="ml-3 text-sm text-muted-foreground">
                                    info@panganku.com
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 4: Media Sosial */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <h3 className="text-lg font-semibold text-foreground">
                            Ikuti Kami
                        </h3>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Dapatkan info produk terbaru dan promo spesial
                            melalui media sosial kami.
                        </p>
                        <div className="mt-4 flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground transition-colors hover:text-primary"
                                >
                                    <span className="sr-only">
                                        {social.name}
                                    </span>
                                    <social.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PERUBAHAN: Bar Bawah menggunakan bg-background */}
            <div className="bg-background">
                <div className="container mx-auto max-w-7xl px-6 py-4 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} PanganKU. All Rights
                    Reserved.
                </div>
            </div>
        </footer>
    );
}
