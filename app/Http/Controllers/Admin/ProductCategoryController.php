<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\CategoryAdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Class ProductCategoryController
 * -------------------------------
 * Controller ini bertugas mengatur lalu lintas data untuk Manajemen Kategori Produk.
 * Controller ini TIDAK melakukan query database langsung, melainkan meminta bantuan
 * kepada 'CategoryAdminService' (Service Pattern).
 */
class ProductCategoryController extends Controller
{
    /**
     * @var CategoryAdminService
     * Service yang menangani logika bisnis kategori (CRUD, Slug, dll).
     */
    protected $categoryService;

    /**
     * Constructor: Dependency Injection
     * Laravel otomatis menyuntikkan CategoryAdminService ke dalam controller ini.
     *
     * @param CategoryAdminService $categoryService
     */
    public function __construct(CategoryAdminService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * [READ] Menampilkan halaman daftar kategori.
     * Mendukung fitur Pencarian dan Pagination.
     *
     * @param Request $request Data dari input URL (misal: ?search=ayam&page=2)
     * @return \Inertia\Response Tampilan React
     */
    public function index(Request $request)
    {
        // 1. Ambil parameter dari URL (Default: 10 data per halaman)
        $perPage = $request->input('per_page', 10);
        $search  = $request->input('search', '');

        // 2. Panggil Service untuk mendapatkan data
        // Kita kirim parameter pencarian dan limit halaman ke Service.
        $categories = $this->categoryService->getAllCategories($perPage, $search);

        // 3. Kembalikan respon ke Frontend (Inertia React)
        return Inertia::render('admin/categories/index', [
            'categories' => $categories, // Data hasil query
            'filters'    => [            // Data state filter untuk frontend
                'search'   => $search,
                'per_page' => $perPage,
            ]
        ]);
    }

    /**
     * [CREATE] Menyimpan kategori baru ke database.
     *
     * @param Request $request Data form input (nama kategori)
     * @return \Illuminate\Http\RedirectResponse Redirect kembali dengan pesan sukses
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        // Nama kategori wajib diisi dan tidak boleh kembar (unique)
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:product_categories,name'
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.unique'   => 'Nama kategori ini sudah ada.',
        ]);

        // 2. Panggil Service untuk simpan data
        // Service akan otomatis membuatkan Slug dari nama tersebut.
        $this->categoryService->createCategory($data);

        // 3. Redirect kembali ke halaman daftar (karena kita pakai Modal/Popup)
        return back()->with('success', 'Kategori berhasil ditambahkan');
    }

    /**
     * [UPDATE] Memperbarui data kategori yang sudah ada.
     *
     * @param Request $request Data form input baru
     * @param int $id ID kategori yang akan diedit
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        // 1. Validasi Input
        // Unique dicek kecuali untuk ID ini sendiri (ignore $id)
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:product_categories,name,'.$id
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.unique'   => 'Nama kategori sudah digunakan.',
        ]);

        // 2. Panggil Service untuk update data
        $this->categoryService->updateCategory($id, $data);

        // 3. Redirect kembali dengan pesan sukses
        return back()->with('success', 'Kategori berhasil diperbarui');
    }

    /**
     * [DELETE] Menghapus kategori dari database.
     *
     * @param int $id ID kategori yang akan dihapus
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        // 1. Panggil Service untuk menghapus data
        // Catatan: Di level database (Migration), pastikan relasi produk
        // sudah diatur (misal: null on delete atau restrict) agar aman.
        $this->categoryService->deleteCategory($id);

        // 2. Redirect kembali
        return back()->with('success', 'Kategori berhasil dihapus');
    }
}
