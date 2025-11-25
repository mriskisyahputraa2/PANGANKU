<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $items = $cart->items()->with('product')->get();

        $items = $items->map(function ($item) {
            if ($item->product && $item->product->image) {
                $item->product->image = asset('storage/' . $item->product->image);
            }
            return $item;
        });
        return Inertia::render('user/cart/index', [
            'items' => $items,
        ]);
    }

    public function add(Request $request)
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $item = $cart->items()->where('product_id', $request->product_id)->first();

        if ($item) {
            $item->increment('quantity');
        } else {
            $cart->items()->create([
                'product_id' => $request->product_id,
                'quantity' => 1,
            ]);
        }

        return back()->with('success', 'Produk ditambahkan ke keranjang!');
    }
    public function updateQuantity(Request $request, $id)
    {
        $item = CartItem::findOrFail($id);
        $item->update(['quantity' => $request->quantity]);
        return back();
    }

    public function remove($id)
    {
        CartItem::findOrFail($id)->delete();
        return back();
    }
}
