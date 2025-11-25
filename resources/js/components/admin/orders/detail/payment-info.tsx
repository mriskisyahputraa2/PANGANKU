import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ExternalLink } from 'lucide-react';

export default function PaymentInfo({ order }) {
    return (
        <Card>
            <CardHeader className="bg-gray-50/50 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CreditCard className="h-4 w-4" /> Pembayaran
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-sm">
                <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-muted-foreground">Metode</span>
                    <span className="font-bold uppercase">
                        {order.payment_method}
                    </span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-muted-foreground">Status Bayar</span>
                    <Badge
                        variant={
                            order.payment_status === 'paid'
                                ? 'default'
                                : 'outline'
                        }
                    >
                        {order.payment_status.toUpperCase()}
                    </Badge>
                </div>

                <div>
                    <span className="mb-2 block text-muted-foreground">
                        Bukti Transfer
                    </span>
                    {order.payment_proof ? (
                        <div className="group relative overflow-hidden rounded-lg border bg-gray-100">
                            <img
                                src={`/storage/${order.payment_proof}`}
                                alt="Bukti Bayar"
                                className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <a
                                href={`/storage/${order.payment_proof}`}
                                target="_blank"
                                className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <ExternalLink className="h-4 w-4" /> Lihat Full
                            </a>
                        </div>
                    ) : (
                        <div className="flex h-20 items-center justify-center rounded border border-dashed bg-gray-50 text-xs text-gray-400">
                            Tidak ada bukti lampiran
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
