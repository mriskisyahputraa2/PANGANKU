<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\ProductAdminService;
use App\Services\Admin\CategoryAdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Class ProductController
 * -----------------------
 * Controller ini bertugas sebagai "Polisi Lalu Lintas" untuk fitur Produk Admin.
 * Tugasnya hanya:
 * 1. Menerima input dari Form (Request).
 * 2. Memvalidasi data (Validasi).
 * 3. Memerintah Service untuk bekerja (Simpan/Update/Hapus).
 * 4. Mengembalikan respon ke layar (Inertia View / Redirect).
 */
class ProductController extends Controller
{
    /**
     * @var ProductAdminService Menangani logika produk (Upload gambar, slug, stok).
     */
    protected $productService;

    /**
     * @var CategoryAdminService Menangani data kategori (untuk dropdown).
     */
    protected $categoryService;

    /**
     * Constructor: Dependency Injection
     * Laravel otomatis memasukkan Service yang kita butuhkan.
     */
    public function __construct(
        ProductAdminService $productService,
        CategoryAdminService $categoryService
    ) {
        $this->productService = $productService;
        $this->categoryService = $categoryService;
    }

    /**
     * [READ] Menampilkan Halaman Daftar Produk.
     * Mendukung fitur Pagination, Pencarian, Filter Kategori, dan Stok.
     */
    public function index(Request $request)
    {
        // 1. Ambil konfigurasi pagination dari URL (Default 10 data)
        $perPage = $request->input('per_page', 10);

        // 2. Kumpulkan semua filter dari URL
        $filters = [
            'search'    => $request->input('search'),
            'category'  => $request->input('category'),
            'low_stock' => $request->input('low_stock'),
        ];

        // 3. Panggil Service untuk ambil data produk (sudah terfilter)
        $products = $this->productService->getAllProducts($perPage, $filters);

        // 4. Panggil Service Kategori (Khusus Dropdown Filter - Bukan Paginasi)
        $categories = $this->categoryService->getForDropdown();

        return Inertia::render('admin/products/index', [
            'products'   => $products,
            'categories' => $categories, // Dikirim untuk isi dropdown filter
            // Kirim balik state filter agar input tidak ter-reset saat refresh
            'filters'    => array_merge($filters, ['per_page' => $perPage]),
        ]);
    }

    /**
     * [CREATE UI] Menampilkan Form Tambah Produk.
     */
    public function create()
    {
        return Inertia::render('admin/products/create', [
            // Kita butuh daftar kategori untuk Dropdown di form tambah
            'categories' => $this->categoryService->getForDropdown(),
        ]);
    }

    /**
     * [STORE] Menyimpan Produk Baru ke Database.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input (Rules Ketat untuk Data Baru)
        $data = $request->validate([
            'category_id'     => 'required|exists:product_categories,id',
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'hpp'             => 'required|numeric|min:0',
            'stock'           => 'required|integer|min:0',
            'production_time' => 'nullable|string|max:50', // Info jam potong
            'image'           => 'required|image|max:2048',  // Wajib ada gambar
        ], [
            'category_id.required' => 'Kategori wajib dipilih.',
            'image.required'       => 'Foto produk wajib diupload.',
            'image.max'            => 'Ukuran foto maksimal 2MB.',
        ]);

        // 2. Panggil Service untuk eksekusi (Termasuk upload gambar & slug)
        // Kita pisahkan file gambar dari array data teks
        $this->productService->createProduct($data, $request->file('image'));

        // 3. Redirect ke Halaman Daftar dengan Pesan Sukses
        return to_route('admin.products.index')->with('success', 'Produk berhasil ditambahkan');
    }

    /**
     * [EDIT UI] Menampilkan Form Edit Produk.
     */
    public function edit($id)
    {
        // Panggil Service untuk mencari produk by ID
        $product = $this->productService->getProductById($id);

        return Inertia::render('admin/products/edit', [
            'product'    => $product,
            'categories' => $this->categoryService->getForDropdown(),
        ]);
    }

    /**
     * [UPDATE] Memperbarui Data Produk.
     */
    public function update(Request $request, $id)
    {
        // 1. Validasi Input (Rules agak longgar untuk Update)
        $data = $request->validate([
            'category_id'     => 'required|exists:product_categories,id',
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'hpp'             => 'required|numeric|min:0',
            'stock'           => 'required|integer|min:0',
            'production_time' => 'nullable|string|max:50',

            // Gambar bersifat 'nullable' (Opsional).
            // Jika user tidak upload gambar baru, Service akan mempertahankan gambar lama.
            'image'           => 'nullable|image|max:2048'
        ]);

        // 2. Panggil Service untuk update
        $this->productService->updateProduct($id, $data, $request->file('image'));

        // 3. Redirect kembali ke halaman daftar
        return to_route('admin.products.index')->with('success', 'Produk berhasil diperbarui');
    }

    /**
     * [DELETE] Menghapus Produk.
     */
    public function destroy($id)
    {
        // Panggil Service untuk hapus (Service juga akan menghapus file gambar fisik)
        $this->productService->deleteProduct($id);

        return back()->with('success', 'Produk berhasil dihapus');
    }
}
