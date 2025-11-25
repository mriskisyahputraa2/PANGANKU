<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productRepo;

    // Inject Repository (Koki)
    public function __construct(ProductRepositoryInterface $productRepo)
    {
        $this->productRepo = $productRepo;
    }

    public function index()
    {
        // Panggil method getAll() dari Repository
        $products = $this->productRepo->getAll();

        // Format data agar mudah dibaca Flutter
        $data = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock' => $product->stock,
                'description' => $product->description,
                'category' => $product->category->name ?? 'Umum',
                'image_url' => $product->image ? asset('storage/' . $product->image) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $product = $this->productRepo->find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Produk tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock' => $product->stock,
                'description' => $product->description,
                'image_url' => $product->image ? asset('storage/' . $product->image) : null,
            ]
        ]);
    }
}
