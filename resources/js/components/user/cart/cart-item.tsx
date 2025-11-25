import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQty, onRemove }) {
    return (
        <Card className="overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex items-start gap-3 p-3 lg:gap-4 lg:p-4">
                {/* Gambar */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-gray-100 lg:h-24 lg:w-24">
                    <img
                        src={
                            item.product?.image
                                ? `/storage/${item.product.image}`
                                : '/images/placeholder.png'
                        }
                        alt={item.product?.name}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Info & Kontrol */}
                <div className="flex min-h-[80px] flex-1 flex-col justify-between lg:min-h-[96px]">
                    <div>
                        <div className="flex items-start justify-between">
                            <h3 className="line-clamp-2 pr-4 text-sm font-bold text-gray-900 lg:text-base">
                                {item.product?.name}
                            </h3>

                            {/* Tombol Hapus Mobile */}
                            <button
                                onClick={() => onRemove(item.id)}
                                className="text-gray-400 hover:text-red-600 lg:hidden"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {item.product?.category?.name || 'Umum'}
                        </p>
                        <p className="mt-1 font-bold text-primary lg:hidden">
                            {formatRupiah(item.product.price)}
                        </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        {/* Qty Control */}
                        <div className="flex h-8 items-center gap-3 rounded-lg border bg-gray-50 px-2 py-1 lg:h-10">
                            <button
                                onClick={() =>
                                    onUpdateQty(
                                        item.id,
                                        item.quantity,
                                        -1,
                                        item.product.stock,
                                    )
                                }
                                className="p-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="h-3 w-3 lg:h-4 lg:w-4" />
                            </button>
                            <span className="min-w-[20px] text-center text-xs font-bold lg:text-sm">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() =>
                                    onUpdateQty(
                                        item.id,
                                        item.quantity,
                                        1,
                                        item.product.stock,
                                    )
                                }
                                className="p-1 text-gray-500 hover:text-green-600"
                            >
                                <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                            </button>
                        </div>

                        {/* Desktop Price & Delete */}
                        <div className="hidden items-center gap-4 lg:flex">
                            <div className="text-right">
                                <p className="font-bold text-gray-900">
                                    {formatRupiah(
                                        item.product.price * item.quantity,
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatRupiah(item.product.price)} / pack
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-red-600"
                                onClick={() => onRemove(item.id)}
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
