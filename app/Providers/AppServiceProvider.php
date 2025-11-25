<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // 1. Binding Produk (Sudah ada)
        $this->app->bind(\App\Repositories\Contracts\ProductRepositoryInterface::class, \App\Repositories\Eloquent\ProductRepository::class);

        // 2. Binding Order (Sudah ada)
        $this->app->bind(\App\Repositories\Contracts\OrderRepositoryInterface::class, \App\Repositories\Eloquent\OrderRepository::class);

        // 3. BINDING KATEGORI (INI YANG KURANG!) <--- TAMBAHKAN INI
        $this->app->bind(\App\Repositories\Contracts\CategoryRepositoryInterface::class, \App\Repositories\Eloquent\CategoryRepository::class);

        // 4. Binding Cart
        $this->app->bind(\App\Repositories\Contracts\CartRepositoryInterface::class, \App\Repositories\Eloquent\CartRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
