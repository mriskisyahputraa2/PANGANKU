<?php

namespace App\Repositories\Contracts;

/**
 * Interface CategoryRepositoryInterface
 * -------------------------------------
 * Kontrak/Menu untuk manajemen data Kategori Produk.
 * Siapapun yang menggunakan interface ini harus menyediakan fitur CRUD dasar.
 */
interface CategoryRepositoryInterface
{
    /** Ambil semua data kategori (biasanya untuk dropdown atau list) */
    public function getAll();

    /** Cari satu kategori berdasarkan ID */
    public function find($id);

    /** Simpan kategori baru ke database */
    public function create(array $data);

    /** Update data kategori yang sudah ada */
    public function update($id, array $data);

    /** Hapus kategori dari database */
    public function delete($id);
}
