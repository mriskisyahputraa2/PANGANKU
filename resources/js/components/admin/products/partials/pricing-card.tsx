import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatRupiah, unformatRupiah } from '@/lib/utils';
import { Clock } from 'lucide-react';

export default function PricingCard({ data, setData, errors }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Harga & Inventaris</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="price">
                            Harga Jual (Rp){' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="price"
                            value={formatRupiah(data.price)}
                            onChange={(e) =>
                                setData('price', unformatRupiah(e.target.value))
                            }
                        />
                        <InputError message={errors.price} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hpp">
                            Harga Modal/HPP (Rp){' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="hpp"
                            value={formatRupiah(data.hpp)}
                            onChange={(e) =>
                                setData('hpp', unformatRupiah(e.target.value))
                            }
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Untuk hitungan profit.
                        </p>
                        <InputError message={errors.hpp} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="stock">
                            Stok Tersedia{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="stock"
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                        />
                        <InputError message={errors.stock} />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="production_time"
                            className="flex items-center gap-1"
                        >
                            Info Fresh / Jam Potong{' '}
                            <Clock className="h-3 w-3 text-blue-500" />
                        </Label>
                        <Input
                            id="production_time"
                            placeholder="Contoh: 04:00 WIB (Pagi Ini)"
                            value={data.production_time}
                            onChange={(e) =>
                                setData('production_time', e.target.value)
                            }
                        />
                        <InputError message={errors.production_time} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
