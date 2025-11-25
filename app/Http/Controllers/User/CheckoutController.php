<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Services\User\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    // Inject Service
    protected $checkoutService;

    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    // Halaman Index (Tampilan Checkout) - Tidak berubah banyak
    public function index(Request $request)
    {
        $productId = $request->get('product_id');
        $user = Auth::user();
        $cartItems = [];
        $total = 0;

        if ($productId) {
            $product = Product::find($productId);
            if ($product) {
                $cartItems = [[
                    'id' => 0,
                    'quantity' => 1,
                    'product' => $product,
                    'product_id' => $product->id
                ]];
                $total = $product->price;
            }
        } else {
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);
            $cartItems = $cart->items()->with('product')->get();
            if ($cartItems->isEmpty()) return redirect()->route('cart.index')->with('error', 'Keranjang kosong.');
            $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
        }

        return Inertia::render('user/checkout/index', [
            'items' => $cartItems,
            'total' => $total,
            'product_id' => $productId,
            'user' => $user,
        ]);
    }

    // Method Store (Proses Checkout) - JAUH LEBIH BERSIH
    public function store(Request $request)
    {
        // 1. Validasi Input (Controller yang urus)
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'delivery_type' => 'required|in:delivery,pickup',
            'shipping_address' => 'required_if:delivery_type,delivery|nullable|string',
            'pickup_time' => 'required|string',
            'payment_method' => 'required|in:tunai,gopay,dana',
            'product_id' => 'nullable|exists:products,id',
            'payment_proof' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        try {
            // 2. Panggil Service (Otak Bisnis)
            $order = $this->checkoutService->processCheckout(
                Auth::user(),
                $validated,
                $request->file('payment_proof')
            );

            // 3. Return Respon Sukses
            return redirect()->route('checkout.sukses', ['order_number' => $order->order_number]);

        } catch (\Exception $e) {
            // Tangkap error dari Service (misal: Stok habis)
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // Method Sukses (Tidak berubah)
    public function sukses(Request $request, $order_number)
    {
        $order = \App\Models\Order::where('order_number', $order_number)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('user/checkout/CheckoutSukses', ['order' => $order]);
    }
}
