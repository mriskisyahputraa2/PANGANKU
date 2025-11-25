<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Admin\ProductAdminService;
use App\Services\Admin\CategoryAdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $productService;
    protected $categoryService;

    // Butuh ProductService (untuk simpan produk)
    // Butuh CategoryService (untuk ambil list kategori buat dropdown di form tambah)
    public function __construct(ProductAdminService $productService, CategoryAdminService $categoryService)
    {
        $this->productService = $productService;
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        // Kumpulkan semua filter
        $filters = [
            'search' => $request->input('search'),
            'category' => $request->input('category'),
            'low_stock' => $request->input('low_stock'),
        ];

        return Inertia::render('admin/products/index', [
            // Kirim filters ke Service
            'products' => $this->productService->getAllProducts($perPage, $filters),
            'categories' => $this->categoryService->getAllCategories(),

            // Kirim balik state filters ke frontend agar input tidak reset
            'filters' => array_merge($filters, ['per_page' => $perPage]),
        ]);
    }

    /**
     *  Menampilkan halaman form Tambah Produk
     */
    public function create()
    {
        // Kita butuh list kategori untuk dropdown di form
        return Inertia::render('admin/products/create', [
            'categories' => $this->categoryService->getAllCategories(),
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi yang ketat
        $data = $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'hpp' => 'required|numeric',
            'stock' => 'required|integer',
            'production_time' => 'nullable|string|max:50',
            'image' => 'required|image|max:2048', // Max 2MB
        ]);

        // 2. Panggil Service
        // Kita pisahkan array data teks dengan file gambar
        $this->productService->createProduct($data, $request->file('image'));

        return to_route('admin.products.index')->with('success', 'Produk berhasil ditambahkan');
    }

    /**
     * [BARU] Menampilkan halaman form Edit Produk
     */
    public function edit($id)
    {
        // Panggil Service untuk ambil data
        $product = $this->productService->getProductById($id);

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $this->categoryService->getAllCategories(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'hpp' => 'required|numeric',
            'stock' => 'required|integer',
            'production_time' => 'nullable|string|max:50',
            'image' => 'nullable|image|max:2048',
        ]);

        $this->productService->updateProduct($id, $data, $request->file('image'));

        return to_route('admin.products.index')->with('success', 'Produk berhasil diperbarui');
    }

    public function destroy($id)
    {
        $this->productService->deleteProduct($id);
        return back()->with('success', 'Produk berhasil dihapus');
    }
}
