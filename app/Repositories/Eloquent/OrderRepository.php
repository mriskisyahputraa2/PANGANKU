<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Models\Order;
use App\Models\OrderItem;

class OrderRepository implements OrderRepositoryInterface
{
    // Simpan data order utama
    public function createOrder(array $data)
    {
        return Order::create($data);
    }

    // Simpan detail item order
    public function createOrderItem(array $data)
    {
        return OrderItem::create($data);
    }

    // Cari order berdasarkan nomor resi
    public function findByOrderNumber(string $orderNumber)
    {
        return Order::where('order_number', $orderNumber)->firstOrFail();
    }

    /**
     * Mengambil daftar pesanan dengan filter yang kompleks.
     */
    public function getAllOrders($perPage = 10, array $filters = [])
    {
        // 1. Mulai Query: Ambil order beserta data user-nya, urutkan dari yang terbaru
        $query = Order::with('user')->latest();

        // 2. Filter Pencarian (Search Box)
        // Mencari berdasarkan Nomor Order ATAU Nama Pelanggan
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%");
            });
        }

        // 3. Filter Status Pesanan (Dropdown)
        // Jika status bukan 'all', kita saring datanya
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // 4. Filter Tipe Pengiriman (Delivery / Pickup)
        if (!empty($filters['delivery_type']) && $filters['delivery_type'] !== 'all') {
            $query->where('delivery_type', $filters['delivery_type']);
        }

        // 5. Filter Rentang Tanggal (Dari Tanggal X)
        if (!empty($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        // 6. Filter Rentang Tanggal (Sampai Tanggal Y)
        if (!empty($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        // 7. Eksekusi Query dengan Pagination
        // withQueryString() penting agar saat klik halaman 2, filter tidak hilang
        return $query->paginate($perPage)->withQueryString();
    }

    public function getUserOrders($userId, $perPage = 10, $status = null)
    {
        $query = Order::with(['items.product']) // Eager load item & produk
            ->where('user_id', $userId)
            ->latest();

        // Jika ada filter status (untuk Tab Navigasi nanti)
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        return $query->paginate($perPage)->withQueryString();
    }
}
