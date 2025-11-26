<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomepageController extends Controller
{

    public function index()
    {
        // Ambil 4 produk (biar pas 1 baris penuh di layar besar)
        $featuredProducts = Product::with('category')
            ->where('stock', '>', 0) // Opsional: Hanya tampilkan yang ada stok
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'stock' => $product->stock, // [FIX 1] Tambah Stok

                    // [FIX 2] Kategori jadi Object { name: ... }
                    'category' => [
                        'name' => $product->category ? $product->category->name : 'Umum'
                    ],

                    // [FIX 3] Kirim nama file saja (Raw Path)
                    // Biarkan Frontend yang menambahkan '/storage/'
                    'image' => $product->image,
                ];
            });

        return Inertia::render('user/homepage/index', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
