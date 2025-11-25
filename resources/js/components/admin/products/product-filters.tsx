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
import { AlertCircle, Filter, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ProductFiltersProps {
    filters: {
        search?: string;
        per_page?: string | number;
        category?: string;
        low_stock?: string;
    };
    categories: { id: number; name: string }[];
}

export default function ProductFilters({
    filters,
    categories,
}: ProductFiltersProps) {
    const [params, setParams] = useState({
        search: filters.search || '',
        per_page: String(filters.per_page || '10'),
        category: filters.category || 'all',
        low_stock: filters.low_stock === 'true',
    });

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => applyFilters(params), 500);
        return () => clearTimeout(timeout);
    }, [params.search]);

    const applyFilters = (currentParams) => {
        const query = {
            search: currentParams.search,
            per_page: currentParams.per_page,
            category:
                currentParams.category === 'all' ? '' : currentParams.category,
            low_stock: currentParams.low_stock ? 'true' : '',
        };
        Object.keys(query).forEach((key) => !query[key] && delete query[key]);

        router.get('/admin/products', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleChange = (key: string, value: any) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);
        if (key !== 'search') applyFilters(newParams);
    };

    const resetFilters = () => {
        const defaultParams = {
            search: '',
            per_page: '10',
            category: 'all',
            low_stock: false,
        };
        setParams(defaultParams);
        applyFilters(defaultParams);
    };

    return (
        <div className="mb-6 space-y-3">
            {/* [PERBAIKAN LAYOUT]
                Menggunakan 'flex' (default row) agar bersebelahan.
                'gap-2' untuk jarak kecil antar elemen.
            */}
            <div className="flex items-center gap-2">
                {/* 1. SEARCH BAR (FLEX-1) */}
                {/* 'flex-1' artinya: Ambil semua sisa ruang yang tersedia */}
                <div className="relative flex-1">
                    <Input
                        placeholder="Cari nama produk..."
                        value={params.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full bg-white pl-9"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                {/* 2. DROPDOWN LIMIT (SHRINK-0) */}
                {/* 'shrink-0' artinya: Jangan mengecil, pertahankan lebar w-[100px] */}
                <Select
                    value={params.per_page}
                    onValueChange={(val) => handleChange('per_page', val)}
                >
                    <SelectTrigger className="w-[105px] shrink-0 bg-white px-3">
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

            {/* BARIS 2: Filter Chips (Kategori & Stok) */}
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="mr-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Filter className="h-4 w-4" />
                </div>

                {/* Dropdown Kategori (Full Width di Mobile, Auto di Desktop) */}
                <Select
                    value={params.category}
                    onValueChange={(val) => handleChange('category', val)}
                >
                    <SelectTrigger className="h-9 w-full border-gray-300 bg-white text-sm sm:w-[180px]">
                        <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Toggle Low Stock */}
                <Button
                    variant={params.low_stock ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleChange('low_stock', !params.low_stock)}
                    className={`h-9 flex-1 gap-2 text-sm sm:flex-none ${!params.low_stock ? 'border-gray-300 bg-white text-gray-700' : ''}`}
                >
                    <AlertCircle className="h-4 w-4" />
                    Stok Menipis
                </Button>

                {/* Reset Button */}
                {(params.search ||
                    params.category !== 'all' ||
                    params.low_stock) && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="ml-auto h-9 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 sm:ml-0"
                    >
                        <X className="mr-1 h-3 w-3" /> Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
