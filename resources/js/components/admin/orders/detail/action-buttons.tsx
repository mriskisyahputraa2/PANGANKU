import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner'; // Import Toast
import TrackingDialog from './tracking-dialog';

export default function ActionButtons({ order }) {
    const [showTrackingDialog, setShowTrackingDialog] = useState(false);

    // Fungsi Utama Update Status ke Backend
    const updateStatus = (newStatus: string, extraData = {}) => {
        const labelAction =
            newStatus === 'dibatalkan' ? 'Membatalkan' : 'Memproses';

        // 1. Tampilkan Loading Toast
        const toastId = toast.loading(`${labelAction} pesanan...`);

        router.put(
            `/admin/orders/${order.id}`,
            {
                status: newStatus,
                ...extraData,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // 2. Sukses
                    toast.dismiss(toastId);
                    toast.success(
                        `Status berhasil diubah menjadi: ${newStatus.toUpperCase()}`,
                    );
                },
                onError: (errors) => {
                    // 3. Gagal (Validasi Backend)
                    toast.dismiss(toastId);
                    console.error(errors);
                    toast.error(
                        'Gagal memperbarui pesanan. Silakan coba lagi.',
                    );
                },
            },
        );
    };

    // Render Tombol Berdasarkan Status Saat Ini
    const renderButtons = () => {
        switch (order.status) {
            // KASUS 1: Pesanan Baru Masuk (Butuh Verifikasi)
            case 'menunggu_verifikasi':
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (
                                    confirm(
                                        'Yakin tolak pesanan ini? Stok akan dikembalikan otomatis.',
                                    )
                                )
                                    // Saat tolak, kita set pembayaran jadi 'failed'
                                    updateStatus('dibatalkan', {
                                        payment_status: 'failed',
                                    });
                            }}
                        >
                            <XCircle className="mr-2 h-4 w-4" /> Tolak
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            // Saat terima, kita set pembayaran jadi 'paid' (Lunas)
                            onClick={() =>
                                updateStatus('diproses', {
                                    payment_status: 'paid',
                                })
                            }
                        >
                            <CheckCircle className="mr-2 h-4 w-4" /> Terima &
                            Proses
                        </Button>
                    </div>
                );

            // KASUS 2: Sedang Diproses (Dapur/Gudang)
            case 'diproses':
                if (order.delivery_type === 'delivery') {
                    // Jika Delivery -> Input Resi
                    return (
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => setShowTrackingDialog(true)}
                        >
                            <Truck className="mr-2 h-4 w-4" /> Kirim Pesanan
                            (Input Resi)
                        </Button>
                    );
                } else {
                    // Jika Pickup -> Tandai Siap
                    return (
                        <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => updateStatus('siap_diambil')}
                        >
                            <Package className="mr-2 h-4 w-4" /> Tandai Siap
                            Diambil
                        </Button>
                    );
                }

            // KASUS 3: Sedang Dikirim / Menunggu Diambil
            case 'dikirim':
            case 'siap_diambil':
                return (
                    <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatus('selesai')}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" /> Selesaikan
                        Pesanan
                    </Button>
                );

            default:
                return null;
        }
    };

    // Jika status sudah final, tidak tampilkan tombol apa-apa
    if (['selesai', 'dibatalkan', 'menunggu_pembayaran'].includes(order.status))
        return null;

    return (
        <>
            {/* Container Tombol */}
            <div className="flex flex-wrap gap-2">{renderButtons()}</div>

            {/* Dialog Input Resi */}
            <TrackingDialog
                open={showTrackingDialog}
                onOpenChange={setShowTrackingDialog}
                onSubmit={(resi) => {
                    // Kirim status 'dikirim' + nomor resi
                    updateStatus('dikirim', { tracking_number: resi });
                    setShowTrackingDialog(false);
                }}
            />
        </>
    );
}
