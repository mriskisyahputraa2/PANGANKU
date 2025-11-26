import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function OrderPagination({ orders }) {
    if (!orders.links || orders.links.length === 0) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t bg-gray-50 px-4 py-4 sm:flex-row sm:px-6">
            <div className="text-center text-xs text-muted-foreground sm:text-left">
                Halaman {orders.current_page} dari {orders.last_page}
            </div>

            <div className="flex flex-wrap justify-center gap-1">
                {orders.links.map((link, i) => {
                    const isMobile =
                        typeof window !== 'undefined' &&
                        window.innerWidth < 640;
                    const isNavButton =
                        link.label.includes('Previous') ||
                        link.label.includes('Next');

                    return link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            preserveScroll
                            className={`${isMobile && !isNavButton && !link.active ? 'hidden' : ''}`}
                        >
                            <Button
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                className={`h-8 min-w-[2rem] ${isNavButton ? 'px-3' : ''}`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label
                                        .replace(
                                            'Next',
                                            '<span class="hidden sm:inline">Next</span> &raquo;',
                                        )
                                        .replace(
                                            'Previous',
                                            '&laquo; <span class="hidden sm:inline">Previous</span>',
                                        ),
                                }}
                            />
                        </Link>
                    ) : (
                        <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            disabled
                            className={`h-8 min-w-[2rem] cursor-not-allowed opacity-50 ${isMobile && !isNavButton ? 'hidden' : ''}`}
                            dangerouslySetInnerHTML={{
                                __html: link.label
                                    .replace(
                                        'Next',
                                        '<span class="hidden sm:inline">Next</span> &raquo;',
                                    )
                                    .replace(
                                        'Previous',
                                        '&laquo; <span class="hidden sm:inline">Previous</span>',
                                    ),
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
