import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function CheckoutForm({ cart, total, product_id, quantity }: any) {
  const { data, setData, post, processing, errors } = useForm({
    customer_name: "",
    customer_phone: "",
    shipping_address: "",
    payment_method: "Dana",
    payment_proof: null as File | null,
    jam_ambil: "",
    product_id: product_id ?? null,
    quantity: quantity ?? 1,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/checkout", {
      forceFormData: true,
      preserveState: false,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setData("payment_proof", file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🛒 Checkout Pesananmu
        </h2>

        <div className="border rounded-lg p-4 bg-gray-50 mb-6">
          {cart.items.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-2 last:border-none"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <span className="text-gray-700">{item.product.name}</span>
              </div>
              <div className="text-gray-700">
                {item.quantity}x Rp {item.product.price.toLocaleString()}
              </div>
            </div>
          ))}
          <div className="text-right font-semibold text-gray-900 mt-3">
            Total: Rp {total.toLocaleString()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-gray-700 font-semibold">Nama Lengkap</label>
            <input
              type="text"
              value={data.customer_name}
              onChange={(e) => setData("customer_name", e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="Masukkan nama lengkap"
            />
            {errors.customer_name && <div className="text-red-500 text-sm mt-1">{errors.customer_name}</div>}
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-gray-700 font-semibold">Nomor Telepon</label>
            <input
              type="text"
              value={data.customer_phone}
              onChange={(e) => setData("customer_phone", e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="Masukkan nomor telepon"
            />
            {errors.customer_phone && <div className="text-red-500 text-sm mt-1">{errors.customer_phone}</div>}
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-gray-700 font-semibold">Alamat Pengambilan / Pengiriman</label>
            <textarea
              value={data.shipping_address}
              onChange={(e) => setData("shipping_address", e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-800"
              rows={3}
              placeholder="Masukkan alamat lengkap..."
            />
            {errors.shipping_address && <div className="text-red-500 text-sm mt-1">{errors.shipping_address}</div>}
          </div>

          {/* Jam ambil */}
          <div>
            <label className="block text-gray-700 font-semibold">Jam Ambil</label>
            <input
              type="time"
              value={data.jam_ambil}
              onChange={(e) => setData("jam_ambil", e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>

          {/* Metode pembayaran */}
          <div>
            <label className="block text-gray-700 font-semibold">Metode Pembayaran</label>
            <select
              value={data.payment_method}
              onChange={(e) => setData("payment_method", e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-800"
            >
              <option value="Dana">Dana</option>
              <option value="Gopay">Gopay</option>
              <option value="Qris">Qris</option>
              <option value="Cod">COD</option>
            </select>
          </div>

          {/* Bukti pembayaran */}
          <div>
            <label className="block text-gray-700 font-semibold">Upload Bukti Pembayaran (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 w-full border rounded-lg p-2 bg-gray-50 text-gray-800"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {processing ? "Memproses..." : "Kirim Pesanan"}
          </button>
        </form>
      </div>
    </div>
  );
}
