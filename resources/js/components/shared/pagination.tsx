import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page?: number;
    last_page?: number;
}

export default function SharedPagination({
    links,
    current_page,
    last_page,
}: PaginationProps) {
    // Jika tidak ada link atau hanya 1 halaman, sembunyikan
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 py-6 sm:flex-row">
            {/* Info Halaman (Opsional, jika data tersedia) */}
            {current_page && last_page && (
                <div className="text-center text-xs text-muted-foreground sm:text-left">
                    Halaman {current_page} dari {last_page}
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-1">
                {links.map((link, i) => {
                    const isMobile =
                        typeof window !== 'undefined' &&
                        window.innerWidth < 640;
                    const isNavButton =
                        link.label.includes('Previous') ||
                        link.label.includes('Next');

                    // HTML Label yang sudah dibersihkan
                    const cleanLabel = link.label
                        .replace('&laquo; Previous', '<< Previous') // Ganti teks panjang jadi pendek
                        .replace('Next &raquo;', 'Next >>');

                    return link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`${isMobile && !isNavButton && !link.active ? 'hidden' : ''}`}
                        >
                            <Button
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                className={`h-9 min-w-[2.5rem] ${isNavButton ? 'px-4' : ''} ${link.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-600'}`}
                            >
                                {cleanLabel}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            disabled
                            className={`h-9 min-w-[2.5rem] cursor-not-allowed opacity-50 ${isMobile && !isNavButton ? 'hidden' : ''}`}
                        >
                            {cleanLabel}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
