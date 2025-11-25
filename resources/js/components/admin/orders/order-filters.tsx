import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Filter, Search, SlidersHorizontal, Truck, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function OrderFilters({ filters }) {
    const [params, setParams] = useState({
        search: filters.search || '',
        status: filters.status || 'all',
        delivery_type: filters.delivery_type || 'all',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        per_page: String(filters.per_page || '10'),
    });

    const [showFilters, setShowFilters] = useState(false);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => applyFilters(params), 500);
        return () => clearTimeout(timeout);
    }, [params.search]);

    const applyFilters = (newParams) => {
        const query = { ...newParams };
        if (query.status === 'all') delete query.status;
        if (query.delivery_type === 'all') delete query.delivery_type;
        if (!query.start_date) delete query.start_date;
        if (!query.end_date) delete query.end_date;

        router.get('/admin/orders', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleChange = (key, value) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);
        if (key !== 'search') applyFilters(newParams);
    };

    const resetFilters = () => {
        const defaultParams = {
            search: '',
            status: 'all',
            delivery_type: 'all',
            start_date: '',
            end_date: '',
            per_page: '10',
        };
        setParams(defaultParams);
        applyFilters(defaultParams);
        setShowFilters(false);
    };

    const hasActiveFilters =
        params.status !== 'all' ||
        params.delivery_type !== 'all' ||
        params.start_date ||
        params.end_date;

    return (
        <div className="mb-6 space-y-3">
            {/* BARIS 1: Search & Toggle (Mobile) */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Input
                        placeholder="Cari No. Order / Nama Pembeli..."
                        value={params.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full bg-white pl-9"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <div className="flex justify-between gap-2 sm:justify-start">
                    <Button
                        variant={showFilters ? 'secondary' : 'outline'}
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex-1 gap-2 bg-white sm:flex-none md:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                        {hasActiveFilters && (
                            <span className="flex h-2 w-2 rounded-full bg-red-500" />
                        )}
                    </Button>

                    <Select
                        value={params.per_page}
                        onValueChange={(val) => handleChange('per_page', val)}
                    >
                        <SelectTrigger className="w-[100px] shrink-0 bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="5">5 Data</SelectItem>
                            <SelectItem value="10">10 Data</SelectItem>
                            <SelectItem value="20">20 Data</SelectItem>
                            <SelectItem value="50">50 Data</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* BARIS 2: Filter Lanjutan */}
            <div
                className={` ${showFilters ? 'flex' : 'hidden'} flex-col flex-wrap items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all duration-300 md:flex md:flex-row md:items-center md:p-3`}
            >
                <div className="mr-1 hidden items-center gap-2 text-sm font-medium text-gray-700 md:flex">
                    <Filter className="h-4 w-4" /> Filter:
                </div>

                {/* Dropdown Status */}
                <Select
                    value={params.status}
                    onValueChange={(val) => handleChange('status', val)}
                >
                    <SelectTrigger className="h-10 w-full border-gray-300 bg-white text-sm md:h-9 md:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="menunggu_pembayaran">
                            Belum Bayar
                        </SelectItem>
                        <SelectItem value="menunggu_verifikasi">
                            Perlu Verifikasi
                        </SelectItem>
                        <SelectItem value="diproses">Diproses</SelectItem>
                        <SelectItem value="dikirim">
                            Dikirim / Pickup
                        </SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                </Select>

                {/* Dropdown Pengiriman */}
                <Select
                    value={params.delivery_type}
                    onValueChange={(val) => handleChange('delivery_type', val)}
                >
                    <SelectTrigger className="h-10 w-full border-gray-300 bg-white text-sm md:h-9 md:w-[160px]">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Truck className="h-3 w-3" />
                            <SelectValue placeholder="Pengiriman" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Tipe</SelectItem>
                        <SelectItem value="delivery">
                            Delivery (Kurir)
                        </SelectItem>
                        <SelectItem value="pickup">Pickup (Ambil)</SelectItem>
                    </SelectContent>
                </Select>

                {/* [PERBAIKAN DISINI] */}
                {/* Menggunakan 'sm:flex-row' agar di Desktop/Tablet sejajar, di HP Kecil tumpuk */}
                <div className="flex w-full flex-col items-center gap-2 sm:flex-row md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <Input
                            type="date"
                            className="h-10 w-full bg-white text-sm md:h-9 md:w-[135px]"
                            value={params.start_date}
                            onChange={(e) =>
                                handleChange('start_date', e.target.value)
                            }
                        />
                    </div>
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                        s/d
                    </span>
                    <div className="relative w-full md:w-auto">
                        <Input
                            type="date"
                            className="h-10 w-full bg-white text-sm md:h-9 md:w-[135px]"
                            value={params.end_date}
                            onChange={(e) =>
                                handleChange('end_date', e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Tombol Reset */}
                {(hasActiveFilters || params.search) && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="mt-2 ml-auto h-10 w-full border-dashed border-gray-300 bg-white text-gray-500 hover:bg-red-50 hover:text-red-600 md:mt-0 md:ml-0 md:h-9 md:w-auto"
                    >
                        <X className="mr-1 h-3 w-3" /> Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
