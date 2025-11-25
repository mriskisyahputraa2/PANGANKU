<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',

        // Data Pelanggan & Pengiriman
        'customer_name',
        'customer_phone',
        'shipping_address', // Wajib jika delivery
        'delivery_type', // 'delivery' atau 'pickup' (BARU)
        'pickup_time', // Jam ambil/antar (BARU)

        // Pembayaran & Status
        'payment_method',
        'payment_status',
        'payment_proof', // Bukti transfer (BARU)
        'status',
        'tracking_number', // Resi/Nama Kurir (BARU)
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
