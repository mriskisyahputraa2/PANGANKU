import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatRupiah } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function CartSummary({ total, onCheckout }) {
    return (
        <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-28">
                <Card className="border-none shadow-md">
                    <CardContent className="space-y-4 p-6">
                        <h3 className="text-lg font-bold">Ringkasan Belanja</h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total Harga
                                </span>
                                <span className="font-medium">
                                    {formatRupiah(total)}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">
                                Total Tagihan
                            </span>
                            <span className="text-xl font-bold text-primary">
                                {formatRupiah(total)}
                            </span>
                        </div>

                        <Button
                            onClick={onCheckout}
                            className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
                        >
                            Lanjut ke Pembayaran{' '}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
