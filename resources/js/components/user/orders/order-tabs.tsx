import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
    { value: 'all', label: 'Semua' },
    { value: 'menunggu_pembayaran', label: 'Belum Bayar' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'dikirim', label: 'Dikirim' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
];

export default function OrderTabs({ currentStatus, onTabChange }) {
    return (
        <div className="mb-6">
            <Tabs
                value={currentStatus}
                onValueChange={onTabChange}
                className="w-full"
            >
                {/* Wrapper Scrollable (Untuk Mobile agar tetap bisa digeser) */}
                <div className="scrollbar-hide w-full overflow-x-auto pb-2 sm:pb-0">
                    {/* TabsList Full Width */}
                    <TabsList className="flex h-auto w-full min-w-max rounded-lg bg-muted p-1 sm:min-w-0">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="w-full flex-1 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
            </Tabs>
        </div>
    );
}
