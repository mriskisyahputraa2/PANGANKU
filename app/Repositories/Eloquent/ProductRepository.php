<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Models\Product;

class ProductRepository implements ProductRepositoryInterface
{
    // --- FITUR USER (STOK) ---
    public function find($id)
    {
        return Product::find($id);
    }
    public function findAndLock($id)
    {
        return Product::lockForUpdate()->find($id);
    }

    public function decrementStock($product, int $quantity)
    {
        // Cek apakah $product itu ID atau Model Objek
        if (is_numeric($product)) {
            $product = Product::find($product);
        }
        return $product->decrement('stock', $quantity);
    }

    public function incrementStock($id, int $quantity)
    {
        return Product::where('id', $id)->increment('stock', $quantity);
    }

    // --- FITUR ADMIN (CRUD) ---

    public function getAll($perPage = 10, array $filters = [])
    {
        $query = Product::with('category')->latest();

        // 1. Logika Search
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        // 2. Logika Filter Kategori
        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        // 3. Logika Filter Stok Menipis (Low Stock)
        if (!empty($filters['low_stock']) && $filters['low_stock'] === 'true') {
            $query->where('stock', '<=', 5);
        }

        // withQueryString() PENTING agar tombol Next/Prev tetap membawa filter search/kategori
        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data)
    {
        return Product::create($data);
    }

    public function update($id, array $data)
    {
        $product = Product::findOrFail($id);
        $product->update($data);
        return $product;
    }

    public function delete($id)
    {
        return Product::destroy($id);
    }
}
