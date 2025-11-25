import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// =======================================================
// == TAMBAHKAN DUA FUNGSI BARU DI BAWAH INI ==
// =======================================================

/**
 * Mengubah angka atau string menjadi format mata uang Rupiah.
 * Contoh: 120000 -> "Rp 120.000"
 * @param value Angka atau string yang akan diformat.
 * @returns String dalam format Rupiah.
 */
export function formatRupiah(value: string | number): string {
    // Jika value kosong atau null, kembalikan string kosong
    if (value === null || value === undefined || value === '') return '';

    // Coba konversi langsung ke angka (menangani "100000.00")
    let num = Number(value);

    // Jika gagal (misal: "Rp 100.000"), bersihkan string dan parse lagi
    if (isNaN(num)) {
        const cleanedString = String(value).replace(/\D/g, '');
        if (cleanedString === '') return '';
        num = parseInt(cleanedString, 10);
    }

    // Jika masih tidak valid, kembalikan string kosong
    if (isNaN(num)) return '';

    // Gunakan Intl.NumberFormat untuk format Rupiah tanpa desimal
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.trunc(num)); // Gunakan trunc untuk keamanan

    return formatted;
}

/**
 * Menghapus format Rupiah dari string, mengembalikan angka dalam bentuk string.
 * Contoh: "Rp 120.000" -> "120000"
 * @param value String dalam format Rupiah.
 * @returns Angka dalam bentuk string.
 */
export function unformatRupiah(value: string): string {
    if (value === null || value === undefined || value === '') return '';
    // Hanya ambil digit dari string
    return value.replace(/\D/g, '');
}
