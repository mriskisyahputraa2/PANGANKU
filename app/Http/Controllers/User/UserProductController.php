<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserProductController extends Controller
{
    /**
     * Menampilkan semua produk untuk user (halaman publik).
     */
    public function index(Request $request)
    {
      $query = Product::with('category')->where('stock', '>', 0);

        // 1. Filter Search
        if ($search = $request->input('search')) {
            $query->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
        }

        // 2. Filter Kategori (Slug)
        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // 3. Sorting (Opsional, default terbaru)
        $query->latest();

        return Inertia::render('user/products/index', [
            'products' => $query->paginate(9)->withQueryString(), // 9 per halaman agar grid 3x3 rapi
            'categories' => ProductCategory::all(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Menampilkan detail 1 produk
     */
    public function show($slug)
    {
        $product = Product::where('slug', $slug)->with('category')->firstOrFail();

        return Inertia::render('user/products/show', [
            'product' => $product,
        ]);
    }
}
