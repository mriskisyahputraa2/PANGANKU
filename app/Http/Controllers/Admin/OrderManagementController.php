<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order; // Masih dipakai untuk Read (Index/Show) agar simpel
use App\Services\Admin\OrderAdminService; // Service Baru
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderManagementController extends Controller
{
    protected $orderAdminService;

    // Inject Service Admin
    public function __construct(OrderAdminService $orderAdminService)
    {
        $this->orderAdminService = $orderAdminService;
    }
    /**
     * Menampilkan halaman Daftar Pesanan.
     */
    public function index(Request $request)
    {
        // 1. Ambil input jumlah data per halaman (Default 10)
        $perPage = $request->input('per_page', 10);

        // 2. Kumpulkan semua input filter dari Frontend
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'delivery_type' => $request->input('delivery_type'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ];

        // 3. Panggil Service untuk mendapatkan data yang sudah difilter
        // Controller tidak perlu tahu query 'where', 'like', dll.
        $orders = $this->orderAdminService->getAllOrders($perPage, $filters);

        // 4. Kirim data ke Tampilan (Inertia React)
        return Inertia::render('admin/order/index', [
            'orders' => $orders,

            // Kembalikan nilai filter ke frontend agar input tidak ter-reset saat refresh
            'filters' => array_merge($filters, ['per_page' => $perPage]),
        ]);
    }

    /**
     * READ: Detail pesanan
     */
    public function show($id)
    {
        // Eager load items & product untuk detail
        $order = Order::with(['user', 'items.product'])->findOrFail($id);

        return Inertia::render('admin/order/show', [
            'order' => $order,
        ]);
    }

    /**
     * WRITE: Update Status (Pakai Service!)
     * Ini bagian krusial yang kita refactor.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:menunggu_pembayaran,menunggu_verifikasi,diproses,dikirim,siap_diambil,selesai,dibatalkan',
            'payment_status' => 'sometimes|string|in:pending,paid,failed,expired',
            'tracking_number' => 'nullable|string',
        ]);

        try {
            // Panggil Service untuk menangani logika berat (termasuk restock stok)
            $order = $this->orderAdminService->updateOrderStatus($id, $validated);

            return redirect()
                ->back()
                ->with('success', 'Pesanan #' . $order->order_number . ' berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Gagal update: ' . $e->getMessage());
        }
    }
}
