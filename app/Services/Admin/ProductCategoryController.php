<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\CategoryAdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    protected $categoryService;

    // Kita panggil Service, bukan Model langsung
    public function __construct(CategoryAdminService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        return Inertia::render('admin/categories/index', [
            'categories' => $this->categoryService->getAllCategories()
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi
        $data = $request->validate(['name' => 'required|string|max:255|unique:product_categories']);

        // 2. Panggil Service
        $this->categoryService->createCategory($data);

        // 3. Respon
        return back()->with('success', 'Kategori berhasil dibuat');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate(['name' => 'required|string|max:255|unique:product_categories,name,'.$id]);

        $this->categoryService->updateCategory($id, $data);

        return back()->with('success', 'Kategori berhasil diupdate');
    }

    public function destroy($id)
    {
        $this->categoryService->deleteCategory($id);
        return back()->with('success', 'Kategori berhasil dihapus');
    }
}
