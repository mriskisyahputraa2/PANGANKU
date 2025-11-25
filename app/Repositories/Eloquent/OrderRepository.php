<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Models\Order;
use App\Models\OrderItem;

class OrderRepository implements OrderRepositoryInterface
{
    // Simpan data order utama
    public function createOrder(array $data)
    {
        return Order::create($data);
    }

    // Simpan detail item order
    public function createOrderItem(array $data)
    {
        return OrderItem::create($data);
    }

    // Cari order berdasarkan nomor resi
    public function findByOrderNumber(string $orderNumber)
    {
        return Order::where('order_number', $orderNumber)->firstOrFail();
    }
}
