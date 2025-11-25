<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Relasi user (set null jika user dihapus agar data penjualan aman)
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('order_number')->unique();

            // Keuangan
            $table->decimal('total_amount', 15, 2); // Total bayar (Tanpa Ongkir)
            $table->string('payment_method', 50); // tunai, gopay, dana
            $table->string('payment_status', 50)->default('pending'); // pending, paid, failed
            $table->string('payment_proof')->nullable(); // Bukti transfer

            // Pengiriman (Hybrid & Tracking)
            $table->string('delivery_type')->default('delivery'); // 'delivery' atau 'pickup'
            $table->string('pickup_time')->nullable(); // Jam request ambil/antar
            $table->string('tracking_number')->nullable(); // Nama Kurir / Resi
            $table->text('shipping_address'); // Alamat (Wajib jika delivery)

            // Data Pembeli
            $table->string('customer_name');
            $table->string('customer_phone');

            // Status Pesanan
            $table->string('status', 50)->default('menunggu_pembayaran');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
