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
     * READ: Menampilkan daftar pesanan.
     * (Untuk Read data sederhana, boleh langsung pakai Model Eloquent agar tidak over-engineering)
     */
    public function index(Request $request)
    {
        $orders = Order::with('user')
            ->when($request->status && $request->status != 'all', function ($query) use ($request) {
                return $query->where('status', $request->status);
            })
            ->when($request->search, function ($query) use ($request) {
                return $query->where('order_number', 'like', '%' . $request->search . '%');
            })
            ->latest()
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('admin/order/index', [
            'orders' => $orders,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
                'per_page' => $request->per_page ?? '10',
            ]
        ]);
    }

    /**
     * READ: Detail pesanan
     */
    public function show($id)
    {
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
            'payment_status' => 'required|string|in:pending,paid,failed,expired',
            'tracking_number' => 'nullable|string',
        ]);

        try {
            // Panggil Service untuk menangani logika berat (termasuk restock stok)
            $order = $this->orderAdminService->updateOrderStatus($id, $validated);

            return redirect()->back()->with(
                'success',
                'Pesanan #' . $order->order_number . ' berhasil diperbarui.'
            );

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal update: ' . $e->getMessage());
        }
    }
}
