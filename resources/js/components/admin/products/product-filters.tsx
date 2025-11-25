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
import {
    AlertCircle,
    Filter,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
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

    // State Toggle Filter (Mobile Only)
    const [showFilters, setShowFilters] = useState(false);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            applyFilters(params);
        }, 500);
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
        setShowFilters(false); // Tutup filter di mobile
    };

    const hasActiveFilters = params.category !== 'all' || params.low_stock;

    return (
        <div className="mb-6 space-y-3">
            {/* === BARIS 1: Search & Toggle === */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Input
                        placeholder="Cari nama produk..."
                        value={params.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full bg-white pl-9"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <div className="flex justify-between gap-2 sm:justify-start">
                    {/* Tombol Filter (Hanya muncul di HP < md) */}
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

                    {/* Dropdown Limit */}
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

            {/* === BARIS 2: Filter Lanjutan (Collapsible) === */}
            {/* Hidden di Mobile (kecuali ditoggle), Flex di iPad/Desktop */}
            <div
                className={` ${showFilters ? 'flex' : 'hidden'} flex-col flex-wrap items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all duration-300 md:flex md:flex-row md:items-center md:p-3`}
            >
                <div className="mr-1 hidden items-center gap-2 text-sm font-medium text-gray-700 md:flex">
                    <Filter className="h-4 w-4" /> Filter:
                </div>

                {/* Dropdown Kategori */}
                <Select
                    value={params.category}
                    onValueChange={(val) => handleChange('category', val)}
                >
                    <SelectTrigger className="h-10 w-full border-gray-300 bg-white text-sm md:h-9 md:w-[180px]">
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
                    className={`h-10 w-full gap-2 text-sm md:h-9 md:w-auto ${!params.low_stock ? 'border-gray-300 bg-white text-gray-700' : ''}`}
                >
                    <AlertCircle className="h-4 w-4" />
                    Stok Menipis
                </Button>

                {/* Reset Button */}
                {(params.search || hasActiveFilters) && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="ml-auto h-10 w-full border-dashed border-gray-300 bg-white text-gray-500 hover:bg-red-50 hover:text-red-600 md:ml-0 md:h-9 md:w-auto"
                    >
                        <X className="mr-1 h-3 w-3" /> Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
