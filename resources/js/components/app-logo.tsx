import { cn } from '@/lib/utils';
// Pastikan path import gambar logo ini sesuai dengan lokasi file Anda
import Logo from '../../assets/images/panganku-logo.png';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className = '' }: AppLogoProps) {
    // Mendeteksi apakah harus teks putih (saat transparan) atau gelap (default)
    const textColorClass = className.includes('text-white')
        ? 'text-white'
        : 'text-foreground';

    return (
        <div className="flex items-center gap-2 md:gap-3">
            <img
                src={Logo}
                alt="PanganKU"
                // Sedikit mengecilkan logo di mobile (h-9) agar proporsional dengan teks
                className="h-9 w-auto md:h-10"
            />

            {/* [PERBAIKAN DISINI] */}
            {/* Sebelumnya ada 'hidden md:block', sekarang dihapus agar TAMPIL SELAMANYA */}
            <div className="block">
                <span
                    className={cn(
                        'block text-lg leading-none font-black tracking-tight md:text-xl',
                        textColorClass,
                    )}
                >
                    PanganKU
                </span>
            </div>
        </div>
    );
}
