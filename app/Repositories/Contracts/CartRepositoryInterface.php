<?php

namespace App\Repositories\Contracts;

interface CartRepositoryInterface
{
    // Ambil keranjang user beserta isinya
    public function getUserCart($userId);

    // Buat keranjang baru untuk user
    public function createCart($userId);

    // Cari item spesifik di dalam keranjang
    public function findCartItem($cartId, $productId);

    // Cari item berdasarkan ID itemnya (untuk update/delete)
    public function findItemById($itemId);

    // Tambah item baru
    public function createItem(array $data);

    // Update item yang ada
    public function updateItem($itemId, array $data);

    // Hapus item
    public function deleteItem($itemId);

    // Kosongkan keranjang (opsional, buat checkout nanti)
    public function clearCart($cartId);
}
