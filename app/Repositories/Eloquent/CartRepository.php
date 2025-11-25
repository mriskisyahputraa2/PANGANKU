<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\CartRepositoryInterface;
use App\Models\Cart;
use App\Models\CartItem;

class CartRepository implements CartRepositoryInterface
{
    public function getUserCart($userId)
    {
        // Eager load product agar data lengkap
        return Cart::with(['items.product.category'])
            ->where('user_id', $userId)
            ->first();
    }

    public function createCart($userId)
    {
        return Cart::create(['user_id' => $userId]);
    }

    public function findCartItem($cartId, $productId)
    {
        return CartItem::where('cart_id', $cartId)
            ->where('product_id', $productId)
            ->first();
    }

    public function findItemById($itemId)
    {
        return CartItem::with('product')->findOrFail($itemId);
    }

    public function createItem(array $data)
    {
        return CartItem::create($data);
    }

    public function updateItem($itemId, array $data)
    {
        // Bisa pakai update query langsung atau via model find
        // Kita pakai where id agar aman
        return CartItem::where('id', $itemId)->update($data);
    }

    public function deleteItem($itemId)
    {
        return CartItem::destroy($itemId);
    }

    public function clearCart($cartId)
    {
        return CartItem::where('cart_id', $cartId)->delete();
    }
}
