<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Class CartController
 * --------------------
 * Controller ini bertugas menangani segala aktivitas Keranjang Belanja (Shopping Cart).
 * Controller ini sudah menerapkan Service Pattern, artinya logika bisnis yang rumit
 * (seperti cek stok, hitung total, buat keranjang baru) dipindahkan ke CartService.
 */
class CartController extends Controller
{
    /**
     * @var CartService Service yang menangani logika bisnis keranjang.
     */
    protected $cartService;

    /**
     * Constructor: Dependency Injection.
     * Laravel otomatis menyuntikkan CartService ke dalam controller ini.
     *
     * @param CartService $cartService
     */
    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * [READ] Menampilkan Halaman Keranjang Belanja.
     * Mengambil data keranjang user yang sedang login beserta total harganya.
     *
     * @return \Inertia\Response Tampilan React (user/cart/index)
     */
    public function index()
    {
        // Panggil Service untuk mendapatkan data keranjang & hitungan total
        $data = $this->cartService->getCartDetails(Auth::id());

        return Inertia::render('user/cart/index', [
            'cart'  => $data['cart'],
            'total' => $data['total'] // Total harga dikirim terpisah agar frontend tidak perlu hitung ulang
        ]);
    }

    /**
     * [CREATE] Menambahkan produk ke dalam keranjang.
     * Method ini menangani logika jika produk sudah ada (update qty) atau belum ada (create new).
     *
     * @param Request $request Data input (product_id, quantity)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function add(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'product_id' => 'required|exists:products,id', // Produk harus ada di database
            'quantity'   => 'nullable|integer|min:1'       // Minimal beli 1
        ]);

        try {
            // 2. Panggil Service untuk memproses penambahan item
            // Service akan otomatis mengecek stok produk sebelum menambahkan.
            $this->cartService->addToCart(
                Auth::id(),
                $request->product_id,
                $request->input('quantity', 1)
            );

            return back()->with('success', 'Produk berhasil masuk keranjang.');

        } catch (\Exception $e) {
            // Jika stok habis atau error lain, kembalikan pesan error ke user
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * [UPDATE] Mengubah jumlah quantity produk di keranjang.
     * Digunakan saat user menekan tombol (+) atau (-) di halaman keranjang.
     *
     * @param Request $request Data input (quantity baru)
     * @param int $id ID dari item keranjang (cart_items.id)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateQuantity(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            // Panggil Service untuk update
            // Service akan memvalidasi apakah stok mencukupi untuk quantity baru tersebut.
            $this->cartService->updateQuantity($id, $request->quantity);

            return back(); // Refresh halaman agar total harga terupdate

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * [DELETE] Menghapus satu item dari keranjang.
     *
     * @param int $id ID dari item keranjang yang akan dihapus
     * @return \Illuminate\Http\RedirectResponse
     */
    public function remove($id)
    {
        // Panggil Service untuk menghapus item
        $this->cartService->removeItem($id);

        return back()->with('success', 'Produk dihapus dari keranjang.');
    }
}
