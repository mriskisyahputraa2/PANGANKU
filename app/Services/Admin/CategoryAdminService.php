<?php

namespace App\Services\Admin;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Support\Str;

class CategoryAdminService
{
    protected $categoryRepo;

    // Inject Repository Kategori
    public function __construct(CategoryRepositoryInterface $categoryRepo)
    {
        $this->categoryRepo = $categoryRepo;
    }

    public function getAllCategories()
    {
        return $this->categoryRepo->getAll();
    }

    public function createCategory(array $data)
    {
        // [LOGIKA BISNIS]
        // Buat Slug otomatis dari Nama (Contoh: "Ayam Bakar" -> "ayam-bakar")
        $data['slug'] = Str::slug($data['name']);

        return $this->categoryRepo->create($data);
    }

    public function updateCategory($id, array $data)
    {
        // Update slug juga jika nama berubah
        $data['slug'] = Str::slug($data['name']);

        return $this->categoryRepo->update($id, $data);
    }

    public function deleteCategory($id)
    {
        return $this->categoryRepo->delete($id);
    }
}
