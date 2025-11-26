import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface ProductFilterProps {
    search: string;
    setSearch: (value: string) => void;
    categories: { id: number; name: string; slug: string }[];
    selectedCategory: string | undefined;
    onCategoryChange: (slug: string | null) => void;
}

export default function ProductFilter({
    search,
    setSearch,
    categories,
    selectedCategory,
    onCategoryChange,
}: ProductFilterProps) {
    return (
        <div className="space-y-6">
            {/* Search Box */}
            <div>
                <h3 className="mb-3 font-display text-lg font-bold">
                    Pencarian
                </h3>
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Cari ayam, daging..."
                        className="bg-white pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Kategori List */}
            <div>
                <h3 className="mb-3 font-display text-lg font-bold">
                    Kategori
                </h3>

                {/* [JAWABAN NO 2] max-h-[400px] overflow-y-auto
                    Ini yang bikin kalau ada 50 kategori, dia akan scroll otomatis
                    tanpa memanjangkan halaman ke bawah. */}
                <div className="custom-scrollbar max-h-[400px] space-y-1 overflow-y-auto pr-2">
                    <div
                        onClick={() => onCategoryChange(null)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-sm transition-all ${!selectedCategory ? 'bg-primary font-medium text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span>Semua Produk</span>
                    </div>

                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.slug)}
                            className={`flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-sm transition-all ${selectedCategory === cat.slug ? 'bg-primary font-medium text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <span>{cat.name}</span>
                            {selectedCategory === cat.slug && (
                                <X className="h-3 w-3" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
