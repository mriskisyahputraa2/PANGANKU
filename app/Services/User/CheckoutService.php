<?php

namespace App\Services\User;

// Kita panggil Interface-nya (Buku Menu), BUKAN file aslinya.
// Biar Laravel yang carikan file aslinya lewat AppServiceProvider tadi.
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class CheckoutService
{
    protected $orderRepo;
    protected $productRepo;

    /**
     * Dependency Injection:
     * Kita minta Interface, Laravel otomatis kasih Repository yang sudah di-bind.
     */
    public function __construct(
        OrderRepositoryInterface $orderRepo,
        ProductRepositoryInterface $productRepo
    ) {
        $this->orderRepo = $orderRepo;
        $this->productRepo = $productRepo;
    }

    /**
     * LOGIKA UTAMA CHECKOUT
     */
    public function processCheckout($user, array $data, ?UploadedFile $proofFile = null)
    {
        return DB::transaction(function () use ($user, $data, $proofFile) {

            // 1. TENTUKAN ITEM
            $itemsToProcess = $this->getItemsToProcess($user, $data);

            // 2. TENTUKAN STATUS & UPLOAD
            $statusData = $this->determineStatusAndProof($data, $proofFile);

            // 3. SUSUN DATA ORDER
            $orderData = [
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'total_amount' => 0,
                'delivery_type' => $data['delivery_type'],
                'shipping_address' => $data['delivery_type'] === 'delivery' ? ($data['shipping_address'] ?? '-') : 'Ambil di Toko (Pickup)',
                'pickup_time' => $data['pickup_time'],
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'status' => $statusData['status'],
                'payment_proof' => $statusData['payment_proof'],
            ];

            // PANGGIL REPOSITORY: Buat Order
            $order = $this->orderRepo->createOrder($orderData);

            $finalTotal = 0;

            // 4. LOOP ITEM & KURANGI STOK
            foreach ($itemsToProcess as $item) {
                // PANGGIL REPOSITORY: Cari & Kunci Stok
                $product = $this->productRepo->findAndLock($item['product_id']);

                if (!$product) {
                    throw new \Exception("Produk ID {$item['product_id']} tidak ditemukan.");
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok '{$product->name}' kurang. Sisa: {$product->stock}");
                }

                // PANGGIL REPOSITORY: Kurangi Stok
                $this->productRepo->decrementStock($product, $item['quantity']);

                // PANGGIL REPOSITORY: Simpan Detail Item
                $this->orderRepo->createOrderItem([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                $finalTotal += $product->price * $item['quantity'];
            }

            // Update Total
            $order->update(['total_amount' => $finalTotal]);

            // 5. BERSIHKAN KERANJANG
            if (empty($data['product_id'])) {
                Cart::where('user_id', $user->id)->first()?->items()->delete();
            }

            return $order;
        });
    }

    // --- HELPER FUNCTIONS ---

    private function getItemsToProcess($user, $data)
    {
        $items = [];
        if (!empty($data['product_id'])) {
            $items[] = ['product_id' => $data['product_id'], 'quantity' => 1];
        } else {
            $cart = Cart::where('user_id', $user->id)->with('items')->first();
            if (!$cart || $cart->items->isEmpty()) throw new \Exception('Keranjang kosong.');
            foreach ($cart->items as $cartItem) {
                $items[] = ['product_id' => $cartItem->product_id, 'quantity' => $cartItem->quantity];
            }
        }
        return $items;
    }

    private function determineStatusAndProof($data, $file)
    {
        $status = 'menunggu_pembayaran';
        $path = null;

        if ($file) {
            $path = $file->store('payment_proofs', 'public');
            $status = 'menunggu_verifikasi';
        } elseif ($data['payment_method'] === 'tunai') {
            $status = 'menunggu_verifikasi';
        }

        return ['status' => $status, 'payment_proof' => $path];
    }
}
