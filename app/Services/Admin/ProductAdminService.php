<?php

namespace App\Services\Admin;

use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ProductAdminService
{
    protected $productRepo;

    public function __construct(ProductRepositoryInterface $productRepo)
    {
        $this->productRepo = $productRepo;
    }

    public function getAllProducts($perPage = 10, array $filters = [])
    {
        return $this->productRepo->getAll($perPage, $filters);
    }

    /**
     * Menangani penyimpanan produk beserta upload gambar.
     * @param array $data Data teks (nama, harga, dll)
     * @param UploadedFile|null $image File gambar (opsional)
     */
    public function createProduct(array $data, ?UploadedFile $image = null)
    {
        // 1. Generate Slug
        $data['slug'] = Str::slug($data['name']) . '-' . Str::lower(Str::random(5));

        if ($image) {
            $data['image'] = $image->store('products', 'public');
        }

        return $this->productRepo->create($data);
    }

    /**
     * Ambil satu produk berdasarkan ID (Untuk Edit)
     */
    public function getProductById($id)
    {
        return $this->productRepo->find($id);
    }

    public function updateProduct($id, array $data, ?UploadedFile $image = null)
    {
       $product = $this->productRepo->find($id);

        // [PERBAIKAN] Cek apakah nama berubah?
        // Jika nama berubah, kita update slugnya (dan tambah random string juga biar aman)
        if ($data['name'] !== $product->name) {
            $data['slug'] = Str::slug($data['name']) . '-' . Str::lower(Str::random(5));
        } else {
            // Jika nama TIDAK berubah, JANGAN ubah slug (biar link lama tetap jalan)
            // Hapus key 'slug' dari array data agar tidak diupdate
            unset($data['slug']);
        }

        if ($image) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $image->store('products', 'public');
        } else {
            unset($data['image']);
        }

        return $this->productRepo->update($id, $data);
    }

    public function deleteProduct($id)
    {
        $product = $this->productRepo->find($id);

        // Bersihkan file gambar saat produk dihapus selamanya
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        return $this->productRepo->delete($id);
    }
}
