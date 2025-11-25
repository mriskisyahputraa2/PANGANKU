<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Models\ProductCategory;

class CategoryRepository implements CategoryRepositoryInterface
{
    // Ambil data terbaru
    public function getAll($perPage = 10, $search = null)
    {
        $query = ProductCategory::latest();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    // Ambil semua data ringkas untuk dropdown
    public function getDropdownList()
    {
        return ProductCategory::orderBy('name', 'asc')->get();
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
