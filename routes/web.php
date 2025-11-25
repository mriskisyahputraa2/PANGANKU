<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\OrderManagementController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\User\HomepageController;
use App\Http\Controllers\User\UserProductController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\CheckoutController;
use App\Http\Controllers\User\TransaksiController;
use App\Http\Controllers\User\UserOrderController;

Route::get('/', [HomepageController::class, 'index'])->name('home');

Route::get('/products', [UserProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [UserProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('admin')
        ->name('admin.')
        ->group(function () {
            Route::resource('categories', ProductCategoryController::class);
            Route::resource('products', ProductController::class);
            Route::resource('orders', OrderManagementController::class)->only(['index', 'show', 'update']);
        });
});
Route::middleware(['auth'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update/{id}', [CartController::class, 'updateQuantity'])->name('cart.update');
    Route::delete('/cart/remove/{id}', [CartController::class, 'remove'])->name('cart.remove');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    // Route::get('/checkout/sukses', [CheckoutController::class, 'sukses'])->name('checkout.sukses');
    // Tambahkan /{order_number} di belakang URL
    Route::get('/checkout/sukses/{order_number}', [CheckoutController::class, 'sukses'])->name('checkout.sukses');
    Route::post('/checkout/now', [CheckoutController::class, 'checkoutNow'])->name('checkout.now');
});

// Halaman pesanan user
Route::middleware(['auth'])->group(function () {
    Route::get('/orders', [UserOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [UserOrderController::class, 'show'])->name('orders.show');
    // Konfirmasi terima barang
    Route::post('/orders/{order}/complete', [UserOrderController::class, 'complete'])->name('orders.complete');

    // Upload Bukti Pembayaran
    Route::put('/orders/{order}/upload-proof', [UserOrderController::class, 'uploadProof'])->name('orders.upload_proof');
    Route::post('/orders/{order}/cancel', [UserOrderController::class, 'cancel'])->name('orders.cancel');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
