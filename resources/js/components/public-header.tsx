import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    Phone,
    ShoppingCart,
    Store,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const publicNavItems = [
    { title: 'Beranda', href: '/', icon: Home },
    { title: 'Produk', href: '/products', icon: Store },
    { title: 'Kontak', href: '/contact', icon: Phone },
];

const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export function PublicHeader({
    transparent = false,
}: {
    transparent?: boolean;
}) {
    // [FITUR 1] Ambil cartCount dari props
    const { auth, cartCount } = usePage().props as any;

    const { url } = usePage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const isAdmin = auth.user && auth.user.role === 'admin';
    const user = auth.user;

    // Deteksi Scroll
    useEffect(() => {
        const handleScroll = () => {
            window.requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 50);
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (href: string) => {
        const currentPath = url.split('?')[0];
        if (href === '/') return currentPath === '/';
        return currentPath.startsWith(href);
    };

    // --- 1. Link Menu Desktop ---
    const NavLink = ({ item }: { item: (typeof publicNavItems)[0] }) => {
        const active = isActive(item.href);
        const textColor = active
            ? 'text-primary font-bold'
            : 'text-gray-700 hover:text-primary font-medium transition-colors';

        return (
            <Link
                href={item.href}
                className={cn(
                    'group relative py-2 text-base transition-colors duration-300',
                    textColor,
                )}
            >
                <span>{item.title}</span>
                <span
                    className={cn(
                        'absolute bottom-0 left-0 h-0.5 w-full origin-left transform bg-primary transition-transform duration-300 ease-out',
                        active
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100',
                    )}
                ></span>
            </Link>
        );
    };

    // --- 2. Link Menu Mobile ---
    const MobileNavLink = ({ item }: { item: (typeof publicNavItems)[0] }) => {
        const active = isActive(item.href);
        return (
            <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                    'group flex items-center justify-between rounded-xl p-3 transition-all duration-200',
                    active
                        ? 'bg-primary/10 font-bold text-primary'
                        : 'text-gray-600 hover:bg-gray-50',
                )}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            'rounded-lg p-2 transition-colors',
                            active
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary',
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                    </div>
                    <span>{item.title}</span>
                </div>
                {active && <div className="h-2 w-2 rounded-full bg-primary" />}
            </Link>
        );
    };

    // --- 3. Layout & Style Header ---
    const headerWrapperClass = cn(
        'fixed z-50 flex w-full justify-center transition-all duration-500 ease-in-out',
        { 'top-0': !isScrolled, 'top-4 px-4': isScrolled },
    );

    const headerContainerClass = cn(
        'mx-auto flex items-center justify-between transition-all duration-500 ease-in-out',
        {
            // AWAL (Full Width)
            'container h-24 w-full max-w-7xl border-none bg-transparent px-6 shadow-none':
                !isScrolled && transparent,

            // SCROLL (Floating)
            'h-16 w-full max-w-5xl rounded-full border border-white/20 bg-white/90 px-8 shadow-lg backdrop-blur-xl':
                isScrolled,

            // BIASA
            'container h-20 w-full max-w-7xl border-b border-gray-100 bg-white px-6 shadow-sm':
                !transparent && !isScrolled,
        },
    );

    const iconClass = 'text-gray-700 hover:text-primary hover:bg-black/5';

    return (
        <div className={headerWrapperClass}>
            <header className={headerContainerClass}>
                {/* KIRI: Logo & Menu Desktop */}
                <div className="flex items-center justify-start gap-10">
                    <Link
                        href="/"
                        className="flex-shrink-0 transition-transform hover:scale-105"
                    >
                        <AppLogo className="text-foreground" />
                    </Link>
                    <nav className="hidden lg:flex">
                        <ul className="flex items-center gap-8">
                            {publicNavItems.map((item) => (
                                <li key={item.title}>
                                    <NavLink item={item} />
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* KANAN: Cart, Auth, Mobile Trigger */}
                <div className="flex items-center space-x-4">
                    {/* Cart Icon (Desktop) */}
                    <div className="hidden items-center space-x-3 lg:flex">
                        <Link href="/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    'relative transition-colors',
                                    iconClass,
                                )}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {/* [FITUR 2] Badge Keranjang Desktop */}
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {user ? (
                            <div className="pl-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-10 w-10 rounded-full border-2 border-primary p-0 transition-transform hover:scale-105"
                                        >
                                            <Avatar className="h-full w-full">
                                                <AvatarImage
                                                    src={user.photo_url}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="mt-2 w-56 rounded-xl border-gray-100 p-2 shadow-xl"
                                        align="end"
                                        forceMount
                                    >
                                        <DropdownMenuLabel className="px-2 py-1.5 font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="truncate text-sm leading-none font-bold text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="my-1" />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                asChild
                                                className="cursor-pointer rounded-lg"
                                            >
                                                <Link href="/profile">
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>Profil Saya</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            {isAdmin && (
                                                <DropdownMenuItem
                                                    asChild
                                                    className="cursor-pointer rounded-lg"
                                                >
                                                    <Link href="/dashboard">
                                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                                        <span>
                                                            Dashboard Admin
                                                        </span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator className="my-1" />
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600"
                                        >
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Keluar</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 pl-2">
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            'font-semibold',
                                            iconClass,
                                        )}
                                    >
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="rounded-full bg-primary px-6 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary/90">
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* TOMBOL MOBILE MENU */}
                    <div className="lg:hidden">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-gray-900 hover:bg-black/5"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>

                            {/* ISI SIDEBAR */}
                            <SheetContent
                                side="right"
                                className="flex w-[85vw] flex-col border-l bg-white p-0 shadow-2xl sm:w-[380px]"
                            >
                                <SheetHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50 px-6 py-4">
                                    <SheetTitle className="text-left">
                                        <AppLogo className="text-foreground" />
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
                                    {/* Profil User Mobile */}
                                    {user ? (
                                        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                <AvatarImage
                                                    src={user.photo_url}
                                                />
                                                <AvatarFallback className="bg-primary font-bold text-white">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-bold text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-gray-400 hover:text-primary"
                                                >
                                                    <ChevronRight className="h-5 w-5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center">
                                            <h3 className="mb-1 text-lg font-bold text-gray-900">
                                                Selamat Datang!
                                            </h3>
                                            <p className="mb-4 text-sm text-gray-500">
                                                Masuk untuk mulai belanja ayam
                                                segar.
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Link
                                                    href="/login"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                    className="w-full"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-primary font-bold text-primary hover:bg-primary/5"
                                                    >
                                                        Masuk
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href="/register"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                    className="w-full"
                                                >
                                                    <Button className="w-full bg-primary font-bold text-white shadow-md hover:bg-primary/90">
                                                        Daftar
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Navigasi Utama */}
                                    <div className="space-y-1">
                                        <p className="mb-2 px-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                            Menu Utama
                                        </p>
                                        {publicNavItems.map((item) => (
                                            <MobileNavLink
                                                key={item.title}
                                                item={item}
                                            />
                                        ))}

                                        {/* Link Cart Mobile dengan Badge */}
                                        <Link
                                            href="/cart"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group flex items-center justify-between rounded-xl p-3 text-gray-600 transition-all duration-200 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-gray-100 p-2 text-gray-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                                                    <ShoppingCart className="h-5 w-5" />
                                                </div>
                                                <span>Keranjang Belanja</span>
                                            </div>
                                            {/* [FITUR 3] Badge Keranjang Mobile */}
                                            {cartCount > 0 && (
                                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>

                                    {user && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1">
                                                <p className="mb-2 px-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                    Akun Saya
                                                </p>

                                                {isAdmin && (
                                                    <Link
                                                        href="/dashboard"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                        className="flex items-center gap-3 rounded-xl p-3 text-gray-600 hover:bg-gray-50"
                                                    >
                                                        <div className="rounded-lg bg-gray-100 p-2">
                                                            <LayoutDashboard className="h-5 w-5 text-gray-500" />
                                                        </div>
                                                        <span>
                                                            Dashboard Admin
                                                        </span>
                                                    </Link>
                                                )}

                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-xl p-3 text-red-600 transition-colors hover:bg-red-50"
                                                >
                                                    <div className="rounded-lg bg-red-50 p-2">
                                                        <LogOut className="h-5 w-5 text-red-500" />
                                                    </div>
                                                    <span>Keluar Aplikasi</span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="border-t bg-gray-50 p-6 text-center text-xs text-gray-400">
                                    &copy; 2025 PanganKU App. v1.0.0
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </div>
    );
}
