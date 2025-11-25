import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Phone, Truck, User } from 'lucide-react';

export default function CustomerInfo({ order }) {
    const isDelivery = order.delivery_type === 'delivery';

    return (
        <Card>
            <CardHeader className="bg-gray-50/50 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" /> Informasi Pelanggan
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-sm">
                <div className="grid grid-cols-[24px_1fr] gap-2">
                    <User className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                        <p className="font-bold text-gray-900">
                            {order.customer_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            User ID: {order.user_id || 'Guest'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-[24px_1fr] gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-gray-400" />
                    <p className="text-gray-700">{order.customer_phone}</p>
                </div>

                <div className="mt-3 border-t pt-3">
                    <p className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Pengiriman
                    </p>

                    <div className="mb-3 grid grid-cols-[24px_1fr] gap-2">
                        {isDelivery ? (
                            <Truck className="h-4 w-4 text-blue-500" />
                        ) : (
                            <MapPin className="h-4 w-4 text-orange-500" />
                        )}
                        <div>
                            <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${isDelivery ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}
                            >
                                {isDelivery
                                    ? 'Delivery (Kurir)'
                                    : 'Pickup (Ambil Sendiri)'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[24px_1fr] gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                        <p className="leading-snug text-gray-700">
                            {order.shipping_address}
                        </p>
                    </div>

                    <div className="mt-3 grid grid-cols-[24px_1fr] gap-2">
                        <Clock className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                            <span className="text-xs text-gray-500">
                                Waktu Request:
                            </span>
                            <p className="font-medium">{order.pickup_time}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
