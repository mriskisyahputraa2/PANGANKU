import { type PropsWithChildren } from 'react';
import Logo from '../../../assets/images/login-panganku-logo.png';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    // Ukuran logo melayang responsif
    const circleSize =
        'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28';

    return (
        <div className="flex min-h-screen min-w-full flex-col items-center justify-center bg-stone-50 p-4 sm:p-6 md:p-10">
            {/* Container utama */}
            <div className="relative flex w-full flex-col items-center">
                {/* Card utama */}
                <div className="w-full max-w-[clamp(320px,50%,500px)] rounded-2xl bg-white p-6 pt-16 shadow-2xl ring-1 shadow-red-900/10 ring-stone-200 sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-8">
                        {/* Judul & Deskripsi */}
                        <div className="flex flex-col items-center gap-4 pt-4">
                            <div className="space-y-1 text-center">
                                <h1 className="text-2xl font-bold tracking-tight text-red-900 sm:text-3xl md:text-4xl">
                                    {title}
                                </h1>
                                <p className="text-sm text-stone-600 sm:text-base md:text-lg">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Konten anak (form login/register) */}
                        <div className="pt-2">{children}</div>
                    </div>
                </div>

                {/* Logo melayang di atas card */}
                <div
                    className={`absolute ${circleSize} -top-10 z-10 flex items-center justify-center rounded-full bg-red-900/90 p-2 shadow-2xl ring-4 ring-white/80 sm:-top-12 sm:p-4 md:-top-14 lg:-top-16`}
                >
                    <img
                        src={Logo}
                        alt="PanganKU Logo"
                        className="h-full w-full rounded-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
