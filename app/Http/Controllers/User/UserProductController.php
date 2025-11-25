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
        // =================================================================
        // ## SEMUA LOGIKA FILTER DIHAPUS ##
        // =================================================================

        // Query disederhanakan:
        // Cukup ambil semua produk, urutkan dari yang terbaru, dan paginasi.
        $products = Product::with('category')
                        ->latest()
                        ->paginate(12) // Menampilkan 12 produk per halaman
                        ->withQueryString(); // Agar paginasi berfungsi

        // Ambil semua kategori (mungkin diperlukan untuk masa depan, tapi tidak wajib)
        $categories = ProductCategory::all();

        // Kirim hanya data yang diperlukan
        return Inertia::render('user/products/index', [
            'products' => $products,
            'categories' => $categories,
            // 'filters' Dihapus
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
