<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\UserOrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserOrderController extends Controller
{
    protected $userOrderService;

    // Inject Service
    public function __construct(UserOrderService $userOrderService)
    {
        $this->userOrderService = $userOrderService;
    }

    // 🧾 Menampilkan daftar semua pesanan user
    public function index(Request $request)
    {
        $status = $request->input('status', 'all');

        // Service otomatis menjalankan auto-cancel di dalamnya
        $orders = $this->userOrderService->getUserOrders(Auth::id(), $status);

        // Format data untuk frontend (bisa juga dilakukan via API Resource, tapi di sini oke)
        $orders->through(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => (float) $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->format('d M Y, H:i'),
                'items' => $order->items, // Sertakan items untuk preview gambar di list
            ];
        });

        return Inertia::render('user/orders/index', [
            'orders' => $orders,
            'currentStatus' => $status, // Untuk Tab Active State
        ]);
    }

    // 🔍 Menampilkan detail pesanan
    public function show($id)
    {
        // Panggil Service
        $order = $this->userOrderService->getOrderDetail($id, Auth::id());

        return Inertia::render('user/orders/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'payment_proof' => $order->payment_proof, // Penting untuk cek sudah upload/belum
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
        try {
            $this->userOrderService->completeOrder($id, Auth::id());
            return back()->with('success', 'Terima kasih! Pesanan telah selesai.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // ✅ FITUR 2: Upload Bukti Pembayaran
    public function uploadProof(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        try {
            $this->userOrderService->uploadPaymentProof($id, Auth::id(), $request->file('payment_proof'));
            return back()->with('success', 'Bukti pembayaran berhasil dikirim! Mohon tunggu verifikasi admin.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // ✅ FITUR 3: Batalkan Pesanan Mandiri
    public function cancel($id)
    {
        try {
            $this->userOrderService->cancelOrder($id, Auth::id());
            return back()->with('success', 'Pesanan berhasil dibatalkan.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
