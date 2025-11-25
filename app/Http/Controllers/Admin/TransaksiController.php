<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaksi; // pastikan model Transaksi sudah ada
use Inertia\Inertia;

class TransaksiController extends Controller
{
    // Menampilkan semua transaksi
    public function index()
    {
        // Ambil semua transaksi dari database
        $transaksi = Transaksi::all();

        // Kirim data ke halaman Inertia
        return Inertia::render('Admin/Transaksi/Index', [
            'transaksi' => $transaksi
        ]);
    }
}
