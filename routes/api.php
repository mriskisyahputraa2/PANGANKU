<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CheckoutController;

/*
|--------------------------------------------------------------------------
| API Routes (KHUSUS UNTUK FLUTTER BUYER)
|--------------------------------------------------------------------------
*/

// =========================================================================
// 1. ZONA PUBLIK (Bisa Diakses Siapa Saja / Tamu)
// =========================================================================
// Biarkan orang melihat-lihat ayam segar tanpa harus login dulu.
// Ini strategi marketing yang bagus agar mereka tertarik.
Route::get('/products', [ProductController::class, 'index']);      // List Ayam
Route::get('/products/{id}', [ProductController::class, 'show']);  // Detail Ayam

// Login & Register untuk pembeli
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// =========================================================================
// 2. ZONA MEMBER (Harus Login / Punya Token)
// =========================================================================
Route::middleware('auth:sanctum')->group(function () {

    // Fitur Akun
    Route::get('/user', [AuthController::class, 'me']);    // Cek Profil
    Route::post('/logout', [AuthController::class, 'logout']); // Keluar

    // Fitur Belanja (Checkout)
    // Admin tidak bisa akses ini lewat Web Controller, tapi kalau Admin iseng login di HP,
    // dia akan dianggap sebagai pembeli biasa. Itu aman.
    Route::post('/checkout', [CheckoutController::class, 'store']);

    // Nanti kita tambahkan: Riwayat Pesanan
    // Route::get('/orders', ...);
});
