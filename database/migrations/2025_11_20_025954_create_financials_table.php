<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('financials', function (Blueprint $table) {
            $table->id();
            // Relasi ke order (opsional, jika pemasukan berasal dari penjualan)
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();

            $table->string('type', 50); // 'income' (pemasukan) atau 'expense' (pengeluaran)
            $table->decimal('amount', 15, 2); // Jumlah uang
            $table->string('description'); // Keterangan (misal: "Penjualan Order #123" atau "Beli Pakan Ayam")
            $table->date('date'); // Tanggal pencatatan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financials');
    }
};
