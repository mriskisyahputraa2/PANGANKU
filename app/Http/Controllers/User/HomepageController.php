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
        // Ambil 3 produk terlaris atau terbaru (bisa kamu ubah logikanya nanti)
        $featuredProducts = Product::with('category')
            ->latest() // urutkan produk dari yang terbaru
            ->take(3)  // ambil 3 produk untuk ditampilkan
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category ? $product->category->name : '-',
                    'price' => $product->price,
                    'image' => $product->image ? asset('storage/' . $product->image) : '/images/placeholder/default-product.png',
                    'slug' => $product->slug,
                ];
            });

        return Inertia::render('user/homepage/index', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
