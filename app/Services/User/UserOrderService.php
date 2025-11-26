<?php

namespace App\Services\User;

use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Carbon\Carbon;
use App\Models\Order; // Kita pakai Model untuk query spesifik status/waktu

class UserOrderService
{
    protected $orderRepo;
    protected $productRepo;

    public function __construct(
        OrderRepositoryInterface $orderRepo,
        ProductRepositoryInterface $productRepo
    ) {
        $this->orderRepo = $orderRepo;
        $this->productRepo = $productRepo;
    }

    /**
     * Logika Auto-Cancel (Lazy Load)
     * Dipanggil otomatis saat user melihat daftar pesanan.
     */
    public function autoCancelExpiredOrders($userId)
    {
        // Cari pesanan expired
        $expiredOrders = Order::where('user_id', $userId)
            ->where('status', 'menunggu_pembayaran')
            ->where('created_at', '<', Carbon::now()->subMinutes(30))
            ->with('items')
            ->get();

        foreach ($expiredOrders as $order) {
            DB::transaction(function () use ($order) {
                // 1. Kembalikan Stok via Repository
                foreach ($order->items as $item) {
                    $this->productRepo->incrementStock($item->product_id, $item->quantity);
                }

                // 2. Update Status
                $order->update([
                    'status' => 'dibatalkan',
                    'payment_status' => 'expired'
                ]);
            });
        }
    }

    /**
     * Ambil daftar pesanan user (Paginated)
     */
    public function getUserOrders($userId, $status = 'all')
    {
        // Jalankan pengecekan expired dulu
        $this->autoCancelExpiredOrders($userId);

        return $this->orderRepo->getUserOrders($userId, 10, $status);
    }

    /**
     * Ambil detail pesanan user
     */
    public function getOrderDetail($orderId, $userId)
    {
        // Jalankan pengecekan expired dulu
        $this->autoCancelExpiredOrders($userId);

        // Pastikan order milik user tersebut
        $order = Order::with(['items.product'])
            ->where('id', $orderId)
            ->where('user_id', $userId)
            ->firstOrFail();

        return $order;
    }

    /**
     * Konfirmasi Terima Barang
     */
    public function completeOrder($orderId, $userId)
    {
        $order = Order::where('id', $orderId)->where('user_id', $userId)->firstOrFail();

        if (!in_array($order->status, ['dikirim', 'siap_diambil'])) {
            throw new \Exception('Pesanan belum bisa diselesaikan.');
        }

        $order->update([
            'status' => 'selesai',
            'payment_status' => 'paid',
        ]);
    }

    /**
     * Upload Bukti Bayar
     */
    public function uploadPaymentProof($orderId, $userId, UploadedFile $file)
    {
        // Cek expired lagi biar aman
        $this->autoCancelExpiredOrders($userId);

        $order = Order::where('id', $orderId)->where('user_id', $userId)->firstOrFail();

        if ($order->status === 'dibatalkan') {
            throw new \Exception('Maaf, waktu pembayaran habis. Pesanan dibatalkan otomatis.');
        }

        if ($order->status !== 'menunggu_pembayaran') {
            throw new \Exception('Pesanan ini tidak membutuhkan bukti pembayaran lagi.');
        }

        // Hapus file lama jika ada
        if ($order->payment_proof) {
            Storage::disk('public')->delete($order->payment_proof);
        }

        // Simpan file baru
        $path = $file->store('payment_proofs', 'public');

        $order->update([
            'payment_proof' => $path,
            'status' => 'menunggu_verifikasi',
        ]);
    }

    /**
     * Batalkan Pesanan (Mandiri)
     */
    public function cancelOrder($orderId, $userId)
    {
        $order = Order::with('items')->where('id', $orderId)->where('user_id', $userId)->firstOrFail();

        if ($order->status !== 'menunggu_pembayaran') {
            throw new \Exception('Pesanan tidak dapat dibatalkan karena sudah diproses.');
        }

        DB::transaction(function () use ($order) {
            // 1. Kembalikan Stok
            foreach ($order->items as $item) {
                $this->productRepo->incrementStock($item->product_id, $item->quantity);
            }

            // 2. Update Status
            $order->update([
                'status' => 'dibatalkan',
                'payment_status' => 'cancelled',
            ]);
        });
    }
}
