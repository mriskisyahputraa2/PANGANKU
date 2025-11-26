import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header'; // Pastikan import ini
import { FC, ReactNode } from 'react';
import { Toaster } from 'sonner';

interface PublicLayoutProps {
    children: ReactNode;
    transparentHeader?: boolean; // <--- WAJIB ADA
}

const PublicLayout: FC<PublicLayoutProps> = ({
    children,
    transparentHeader = false,
}) => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans antialiased">
            {/* Kirim prop 'transparent' ke Header */}
            <PublicHeader transparent={transparentHeader} />

            {/* Jika transparan, konten naik ke atas (-mt-20). Jika tidak, konten turun (pt-20) */}
            <main className={`flex-1 ${transparentHeader ? '-mt-0' : 'pt-20'}`}>
                {children}
            </main>

            <PublicFooter />
            <Toaster richColors position="bottom-right" />
        </div>
    );
};

export default PublicLayout;
