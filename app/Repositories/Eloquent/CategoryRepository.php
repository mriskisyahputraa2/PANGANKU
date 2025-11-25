<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Models\ProductCategory;

class CategoryRepository implements CategoryRepositoryInterface
{
    // Ambil data terbaru
    public function getAll()
    {
        return ProductCategory::latest()->get();
    }

    // Cari data, error jika tidak ketemu (404)
    public function find($id)
    {
        return ProductCategory::findOrFail($id);
    }

    // Simpan ke tabel product_categories
    public function create(array $data)
    {
        return ProductCategory::create($data);
    }

    // Update data
    public function update($id, array $data)
    {
        $category = $this->find($id);
        $category->update($data);
        return $category;
    }

    // Hapus data
    public function delete($id)
    {
        return ProductCategory::destroy($id);
    }
}
