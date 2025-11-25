<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\User\CheckoutService; // <-- Panggil Service User
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    protected $checkoutService;

    // Inject Service (Otak)
    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    public function store(Request $request)
    {
        // 1. Validasi Input (Sama dengan Web)
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'delivery_type' => 'required|in:delivery,pickup',
            'shipping_address' => 'required_if:delivery_type,delivery|nullable|string',
            'pickup_time' => 'required|string',
            'payment_method' => 'required|in:tunai,gopay,dana',
            'product_id' => 'nullable|exists:products,id',
            'payment_proof' => 'nullable|image|max:5120',
        ]);

        try {
            // 2. PANGGIL SERVICE YANG SAMA DENGAN WEB
            // $request->user() otomatis mengambil user dari Token Sanctum
            $order = $this->checkoutService->processCheckout(
                $request->user(),
                $validated,
                $request->file('payment_proof')
            );

            // 3. Return JSON (Khusus HP)
            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat',
                'data' => [
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
