<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductCategory::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->input('per_page', 5);

        $categories = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/categories/create');
    }

    public function store(Request $request)
    {
        // 1. Validasi hanya 'name'
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:product_categories',
        ]);

        // 2. Buat slug secara otomatis di backend
        $validated['slug'] = Str::slug($validated['name']);

        // 3. Simpan ke database
        ProductCategory::create($validated);

        return redirect()->route('admin.categories.index')
           ->with('success', 'Kategori baru berhasil ditambahkan!');
    }

    public function edit(ProductCategory $category)
    {
        return Inertia::render('admin/categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, ProductCategory $category)
    {
        // 1. Validasi hanya 'name'
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:product_categories,name,' . $category->id,
        ]);

        // 2. Buat ulang slug secara otomatis
        $validated['slug'] = Str::slug($validated['name']);

        // 3. Update data di database
        $category->update($validated);

        return redirect()->route('admin.categories.index')
           ->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(ProductCategory $category)
    {
        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
