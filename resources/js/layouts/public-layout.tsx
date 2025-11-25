import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { FC, ReactNode } from 'react';
import { Toaster } from 'sonner';

interface PublicLayoutProps {
    children: ReactNode;
}

const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
    return (
        // Perubahan: Mengganti bg-white menjadi bg-gray-50
        <div className="flex min-h-screen flex-col bg-gray-50">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <PublicFooter />
            <Toaster richColors position="bottom-right" />
        </div>
    );
};

export default PublicLayout;
