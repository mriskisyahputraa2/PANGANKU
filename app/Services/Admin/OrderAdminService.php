<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Support\Facades\DB;

class OrderAdminService
{
    protected $orderRepo;
    protected $productRepo;

    // Kita pakai Repository yang SAMA dengan milik User (Reusability!)
    public function __construct(
        OrderRepositoryInterface $orderRepo,
        ProductRepositoryInterface $productRepo
    ) {
        $this->orderRepo = $orderRepo;
        $this->productRepo = $productRepo;
    }

    /**
     * Update status pesanan secara umum.
     * Menangani logika khusus jika status berubah jadi "dibatalkan" (Restock).
     */
    public function updateOrderStatus($orderId, array $data)
    {
        return DB::transaction(function () use ($orderId, $data) {
            // 1. Ambil Data Order (tanpa lock, karena admin punya kuasa penuh)
            // Kita bisa pakai find biasa dari Eloquent atau tambahkan findById di Repo.
            // Untuk praktis, kita akses model via Repo (jika ada) atau langsung Model jika Repo belum support findById.
            // Sesuai kontrak sebelumnya, kita punya findByOrderNumber, tapi belum punya findById.
            // Mari kita pakai Eloquent biasa untuk find ID agar cepat, atau tambahkan di kontrak nanti.
            $order = Order::with('items')->findOrFail($orderId);

            $newStatus = $data['status'];
            $oldStatus = $order->status;

            // 2. LOGIKA KHUSUS: PEMBATALAN
            // Jika status baru adalah 'dibatalkan' DAN status lama belum 'dibatalkan'
            // Maka kita WAJIB mengembalikan stok.
            if ($newStatus === 'dibatalkan' && $oldStatus !== 'dibatalkan') {
                foreach ($order->items as $item) {
                    // Panggil Repository Produk untuk kembalikan stok
                    $this->productRepo->incrementStock($item->product_id, $item->quantity);
                }

                // Set juga status pembayaran jadi failed/expired
                $order->payment_status = 'failed';
            }

            // 3. LOGIKA PENGIRIMAN (Input Resi)
            if ($newStatus === 'dikirim' && !empty($data['tracking_number'])) {
                $order->tracking_number = $data['tracking_number'];
            }

            // 4. Update Data Utama
            $order->status = $newStatus;

            // Jika admin mengubah status pembayaran juga
            if (isset($data['payment_status'])) {
                $order->payment_status = $data['payment_status'];
            }

            $order->save();

            return $order;
        });
    }
}
