<?php

namespace App\Repositories\Contracts;

/**
 * Interface OrderRepositoryInterface
 * * Ini adalah Kontrak untuk manajemen data Pesanan (Order).
 * Memastikan bahwa aplikasi kita punya cara standar untuk membuat dan mencari order.
 */
interface OrderRepositoryInterface
{
    /**
     * Membuat data Order utama (Header).
     * * @param array $data Data pesanan (user_id, total, alamat, dll)
     * @return \App\Models\Order
     */
    public function createOrder(array $data);

    /**
     * Membuat detail item dalam order (Pivot Table / Order Items).
     * * @param array $data Data item (order_id, product_id, quantity, price)
     * @return \App\Models\OrderItem
     */
    public function createOrderItem(array $data);

    /**
     * Mencari data order berdasarkan Nomor Resi Unik (Order Number).
     * Berguna untuk halaman "Sukses Checkout" atau pelacakan.
     * * @param string $orderNumber Kode unik pesanan (misal: ORD-XK99)
     * @return \App\Models\Order
     */
    public function findByOrderNumber(string $orderNumber);

    /**
     * Mengambil semua data order dengan fitur Filter & Paginasi.
     * * @param int $perPage Jumlah data per halaman (Default 10)
     * @param array $filters Array berisi filter (search, status, tanggal, dll)
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getAllOrders($perPage = 10, array $filters = []);
}
