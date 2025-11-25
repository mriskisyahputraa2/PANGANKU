<?php

namespace App\Repositories\Contracts;

/**
 * Interface ProductRepositoryInterface
 * * Ini adalah "Buku Menu" atau Kontrak untuk manajemen data Produk.
 * Siapapun yang mengimplementasikan interface ini (misal: MySQL, Firebase, dll)
 * WAJIB memiliki fungsi-fungsi di bawah ini.
 */
interface ProductRepositoryInterface
{
    // --- BAGIAN USER (CHECKOUT) ---
    /**
     * Mencari satu data produk berdasarkan ID-nya.
     * * @param int $id ID Produk yang dicari
     * @return \App\Models\Product|null
     */
    public function find($id);

    /**
     * Mencari produk DAN mengunci baris data tersebut di database (Pessimistic Locking).
     * Fungsinya agar stok tidak bentrok jika ada 2 orang checkout bersamaan.
     * * @param int $id ID Produk
     * @return \App\Models\Product|null
     */
    public function findAndLock($id);

    /**
     * Mengurangi stok produk sejumlah quantity yang dibeli.
     * * @param mixed $product Objek Produk atau ID Produk
     * @param int $quantity Jumlah yang dikurangi
     * @return bool|int
     */
    public function decrementStock($product, int $quantity);

    /**
     * Menambah kembali stok produk (misal: jika pesanan dibatalkan/expired).
     * * @param int $id ID Produk
     * @param int $quantity Jumlah yang dikembalikan
     * @return int
     */
    public function incrementStock($id, int $quantity);

    // --- BAGIAN ADMIN (MANAJEMEN) ---

    /** Ambil 10 produk beserta relasi kategorinya */
    public function getAll($perPage = 10, array $filters = []);

    /** Simpan produk baru */
    public function create(array $data);

    /** Update produk */
    public function update($id, array $data);

    /** Hapus produk */
    public function delete($id);
}
