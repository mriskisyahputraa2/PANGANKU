<?php

namespace App\Services\User;

use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface; // Kita butuh ini buat cek stok
use Illuminate\Support\Facades\DB;

class CartService
{
    protected $cartRepo;
    protected $productRepo;

    public function __construct(
        CartRepositoryInterface $cartRepo,
        ProductRepositoryInterface $productRepo
    ) {
        $this->cartRepo = $cartRepo;
        $this->productRepo = $productRepo;
    }

    /**
     * Ambil data keranjang + Hitung Total
     */
    public function getCartDetails($userId)
    {
        // 1. Ambil atau Buat Keranjang
        $cart = $this->cartRepo->getUserCart($userId);

        if (!$cart) {
            $cart = $this->cartRepo->createCart($userId);
            // Refresh agar relasi 'items' kosong tersedia (bukan null)
            $cart->load('items');
        }

        // 2. Hitung Total (Logic Bisnis)
        $total = $cart->items->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return [
            'cart' => $cart,
            'total' => $total
        ];
    }

    /**
     * Logika Tambah ke Keranjang
     */
    public function addToCart($userId, $productId, $qty)
    {
        return DB::transaction(function () use ($userId, $productId, $qty) {
            $product = $this->productRepo->find($productId);

            // Validasi Stok Awal
            if ($product->stock < $qty) {
                throw new \Exception("Stok produk tidak mencukupi.");
            }

            // Ambil/Buat Keranjang
            $cart = $this->cartRepo->getUserCart($userId);
            if (!$cart) $cart = $this->cartRepo->createCart($userId);

            // Cek apakah item sudah ada?
            $cartItem = $this->cartRepo->findCartItem($cart->id, $productId);

            if ($cartItem) {
                // Jika ada, update Qty (Cek stok akumulasi)
                $newQty = $cartItem->quantity + $qty;
                if ($newQty > $product->stock) {
                    throw new \Exception("Stok maksimal tercapai ({$product->stock}).");
                }
                $this->cartRepo->updateItem($cartItem->id, ['quantity' => $newQty]);
            } else {
                // Jika belum, buat baru
                $this->cartRepo->createItem([
                    'cart_id' => $cart->id,
                    'product_id' => $productId,
                    'quantity' => $qty
                ]);
            }
        });
    }

    /**
     * Logika Update Qty (+ / -)
     */
    public function updateQuantity($itemId, $newQty)
    {
        $item = $this->cartRepo->findItemById($itemId);

        // Cek Stok Realtime
        if ($newQty > $item->product->stock) {
            throw new \Exception("Stok hanya tersisa {$item->product->stock}.");
        }

        return $this->cartRepo->updateItem($itemId, ['quantity' => $newQty]);
    }

    public function removeItem($itemId)
    {
        return $this->cartRepo->deleteItem($itemId);
    }
}
