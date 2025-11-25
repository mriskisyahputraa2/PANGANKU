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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    Phone,
    ShoppingCart,
    Store,
    User,
} from 'lucide-react';
import { useState } from 'react';

// Navigasi
const publicNavItems = [
    { title: 'Beranda', href: '/', icon: Home },
    { title: 'Daftar Produk', href: '/products', icon: Store },
    { title: 'Kontak', href: '/contact', icon: Phone },
];

// Helper inisial
const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export function PublicHeader() {
    const { auth } = usePage().props as any;
    const { url } = usePage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAdmin = auth.user && auth.user.role === 'admin';

    // Cek link aktif
    const isActive = (href: string) => {
        const currentPath = url.split('?')[0];
        if (href === '/') return currentPath === '/';
        return currentPath.startsWith(href);
    };

    // Komponen NavLink untuk Desktop
    const NavLink = ({ item }: { item: (typeof publicNavItems)[0] }) => (
        <Link
            href={item.href}
            className={cn(
                'group relative py-2 text-base font-medium transition-colors duration-300',
                // Style Sesuai app.css
                isActive(item.href)
                    ? 'font-semibold text-primary' // Aktif: Hijau
                    : 'text-muted-foreground hover:text-foreground', // Tidak Aktif: Abu-abu
            )}
        >
            <span>{item.title}</span>
            <span
                className={cn(
                    'absolute bottom-1 left-0 h-0.5 w-full origin-left transform bg-primary transition-transform duration-300 ease-out',
                    isActive(item.href)
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100',
                )}
            ></span>
        </Link>
    );

    return (
        // Header Cerah: Sesuai app.css (bg-card = Putih, border-border = Abu-abu)
        <header className="sticky top-0 z-40 w-full border-b border-border bg-card text-foreground shadow-sm">
            <div className="container mx-auto flex h-20 items-center justify-between gap-8 px-4 md:max-w-7xl">
                <div className="flex flex-1 items-center justify-start gap-8">
                    <Link href="/">
                        <AppLogo className="h-8 w-auto" />
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

                <div className="flex items-center space-x-2">
                    {/* Tombol Desktop */}
                    <div className="hidden items-center space-x-4 lg:flex">
                        <Link href="/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span className="sr-only">
                                    Keranjang Belanja
                                </span>
                            </Button>
                        </Link>
                        <Link href="/products">
                            <Button className="shine-effect">
                                Belanja Sekarang
                            </Button>
                        </Link>

                        {auth.user ? (
                            // Dropdown User (Logged In)
                            <div className="pl-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-9 w-9 rounded-full"
                                        >
                                            <Avatar className="h-9 w-9 border-2 border-primary">
                                                <AvatarImage
                                                    src={auth.user.photo_url}
                                                    alt={auth.user.name}
                                                />
                                                <AvatarFallback className="bg-primary/20 font-bold text-primary">
                                                    {getInitials(
                                                        auth.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                        forceMount
                                    >
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="truncate text-sm leading-none font-medium">
                                                    {auth.user.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {auth.user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile">
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>Profil Saya</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            {isAdmin && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/dashboard">
                                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                                        <span>Dashboard</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full text-destructive"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Logout</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            // Tombol Login/Register (Logged Out)
                            <div className="flex items-center space-x-2 pl-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-foreground transition hover:text-primary"
                                >
                                    Login
                                </Link>
                                <Link href="/register">
                                    <Button
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                    >
                                        Daftar
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Tombol Menu Mobile */}
                    <div className="lg:hidden">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-foreground hover:bg-accent"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="flex w-80 flex-col bg-card p-0 text-foreground"
                            >
                                {/* ======================================== */}
                                {/* ## KONTEN SHEET/MENU MOBILE DIMULAI ## */}
                                {/* ======================================== */}

                                {/* 1. Header Menu Mobile */}
                                <div className="border-b border-border p-6">
                                    <Link
                                        href="/"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <AppLogo />
                                    </Link>
                                </div>

                                {/* 2. Link Navigasi Mobile */}
                                <div className="flex-1 space-y-4 p-6">
                                    {publicNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={cn(
                                                'flex items-center space-x-3 rounded-md p-2 text-lg font-medium transition-colors',
                                                isActive(item.href)
                                                    ? 'bg-accent text-primary' // Latar Hijau Pucat
                                                    : 'text-foreground hover:bg-accent',
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    ))}
                                </div>

                                {/* 3. Tombol Auth Mobile (di Bawah) */}
                                <div className="space-y-4 border-t border-border p-6">
                                    {auth.user ? (
                                        // Jika Logged In (Mobile)
                                        <>
                                            <div className="mb-4 flex items-center space-x-3">
                                                <Avatar className="h-10 w-10 border-2 border-primary">
                                                    <AvatarImage
                                                        src={
                                                            auth.user.photo_url
                                                        }
                                                        alt={auth.user.name}
                                                    />
                                                    <AvatarFallback className="bg-primary/20 font-bold text-primary">
                                                        {getInitials(
                                                            auth.user.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="truncate">
                                                    <p className="truncate font-medium text-foreground">
                                                        {auth.user.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href="/profile"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                                className="flex items-center space-x-3 rounded-md p-2 hover:bg-accent"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profil Saya</span>
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                    className="flex items-center space-x-3 rounded-md p-2 hover:bg-accent"
                                                >
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            )}
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center space-x-3 rounded-md p-2 text-destructive hover:bg-accent"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Logout</span>
                                            </Link>
                                        </>
                                    ) : (
                                        // Jika Logged Out (Mobile)
                                        <div className="space-y-3">
                                            <Link
                                                href="/login"
                                                className="w-full"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    Login
                                                </Button>
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="w-full"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <Button className="shine-effect w-full">
                                                    Daftar
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                {/* ======================================== */}
                                {/* ## KONTEN SHEET/MENU MOBILE SELESAI ## */}
                                {/* ======================================== */}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
