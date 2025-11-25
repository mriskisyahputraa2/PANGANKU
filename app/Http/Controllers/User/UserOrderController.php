<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product; // Tambahkan ini
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Tambahkan ini untuk Transaction
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon; // Tambahkan ini untuk waktu

class UserOrderController extends Controller
{
    /**
     * =================================================================
     * LOGIKA AUTO-CANCEL (LAZY LOAD)
     * Dipanggil setiap kali user membuka halaman order.
     * =================================================================
     */
    private function autoCancelExpiredOrders()
    {
        // 1. Cari pesanan milik user ini yang statusnya 'menunggu_pembayaran'
        // DAN sudah lewat 30 menit dari waktu dibuat
        $expiredOrders = Order::where('user_id', Auth::id())
            ->where('status', 'menunggu_pembayaran')
            ->where('created_at', '<', Carbon::now()->subMinutes(30))
            ->with('items') // Eager load items
            ->get();

        foreach ($expiredOrders as $order) {
            DB::beginTransaction();
            try {
                // A. Kembalikan Stok Produk
                foreach ($order->items as $item) {
                    // Pakai query langsung agar lebih aman
                    Product::where('id', $item->product_id)
                           ->increment('stock', $item->quantity);
                }

                // B. Ubah Status jadi Dibatalkan
                $order->update([
                    'status' => 'dibatalkan',
                    'payment_status' => 'expired'
                ]);

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                // Silent error (jangan ganggu flow user cuma karena cron error)
            }
        }
    }

    // 🧾 Menampilkan daftar semua pesanan user
    public function index()
    {
        // [TRIGGER] Cek kadaluarsa sebelum menampilkan data
        $this->autoCancelExpiredOrders();

        $orders = Order::with(['items.product'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at->format('d M Y, H:i'),
                ];
            });

        return Inertia::render('user/orders/OrdersIndex', [
            'orders' => $orders,
        ]);
    }

    // 🔍 Menampilkan detail pesanan
    public function show($id)
    {
        // [TRIGGER] Cek kadaluarsa juga di sini
        $this->autoCancelExpiredOrders();

        $order = Order::with(['items.product'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('user/orders/OrdersShow', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'total_amount' => (float) $order->total_amount,
                'shipping_address' => $order->shipping_address,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'delivery_type' => $order->delivery_type,
                'pickup_time' => $order->pickup_time,
                'tracking_number' => $order->tracking_number,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'quantity' => $item->quantity,
                        'price' => (float) $item->price,
                        'product' => $item->product,
                    ];
                }),
                'created_at_timestamp' => $order->created_at->timestamp * 1000,
                'created_at_formatted' => $order->created_at->format('d M Y, H:i'),
            ],
        ]);
    }

    // ✅ FITUR 1: Konfirmasi Pesanan Diterima
    public function complete($id)
    {
        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        if (!in_array($order->status, ['dikirim', 'siap_diambil'])) {
            return back()->with('error', 'Pesanan belum bisa diselesaikan.');
        }

        $order->update([
            'status' => 'selesai',
            'payment_status' => 'paid', // Asumsi COD lunas saat diterima
        ]);

        return back()->with('success', 'Terima kasih! Pesanan telah selesai.');
    }

    // ✅ FITUR 2: Upload Bukti Pembayaran
    public function uploadProof(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Cek lagi apakah order expired sebelum upload (Double Check)
        $this->autoCancelExpiredOrders();

        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        // Jika status sudah berubah jadi dibatalkan karena expired
        if ($order->status === 'dibatalkan') {
            return back()->with('error', 'Maaf, waktu pembayaran habis. Pesanan dibatalkan otomatis.');
        }

        if ($order->status !== 'menunggu_pembayaran') {
            return back()->with('error', 'Pesanan ini tidak membutuhkan bukti pembayaran lagi.');
        }

        if ($request->hasFile('payment_proof')) {
            if ($order->payment_proof) {
                Storage::disk('public')->delete($order->payment_proof);
            }

            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            $order->update([
                'payment_proof' => $path,
                'status' => 'menunggu_verifikasi',
            ]);
        }

        return back()->with('success', 'Bukti pembayaran berhasil dikirim! Mohon tunggu verifikasi admin.');
    }

    // ✅ FITUR 3: Batalkan Pesanan Mandiri
    public function cancel($id)
    {
        $order = Order::with('items')->where('user_id', Auth::id())->findOrFail($id);

        if ($order->status !== 'menunggu_pembayaran') {
            return back()->with('error', 'Pesanan tidak dapat dibatalkan karena sudah diproses.');
        }

        DB::transaction(function () use ($order) {
            // 1. Kembalikan Stok
            foreach ($order->items as $item) {
                Product::where('id', $item->product_id)->increment('stock', $item->quantity);
            }

            // 2. Update Status
            $order->update([
                'status' => 'dibatalkan',
                'payment_status' => 'cancelled',
            ]);
        });

        return back()->with('success', 'Pesanan berhasil dibatalkan.');
    }
}
