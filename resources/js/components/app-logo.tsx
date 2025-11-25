import { cn } from '@/lib/utils';
import Logo from '../../assets/images/panganku-logo.png';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className = '' }: AppLogoProps) {
    return (
        <div className={cn('flex items-center', className)}>
            {/* PERUBAHAN DI SINI:
              - 'div' yang membungkus <img> telah dihapus.
              - Ukuran (h-12) dan w-auto (agar proporsional) diterapkan langsung ke <img>
            */}
            <img
                src={Logo}
                alt="PanganKU"
                className="h-12 w-auto" // Atur tinggi, lebar akan menyesuaikan
            />

            {/* Bagian teks ini sudah benar */}
            <div className="ml-4 grid text-left text-lg">
                <span className="truncate leading-tight font-semibold text-foreground">
                    PanganKU
                </span>
            </div>
        </div>
    );
}
