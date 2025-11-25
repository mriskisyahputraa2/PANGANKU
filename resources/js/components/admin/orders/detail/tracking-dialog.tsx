import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function TrackingDialog({ open, onOpenChange, onSubmit }) {
    const [resi, setResi] = useState('');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Input Info Pengiriman</DialogTitle>
                    <DialogDescription>
                        Masukkan nama kurir atau nomor resi untuk melacak
                        pesanan.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label className="mb-2 block">Nama Kurir / No. Resi</Label>
                    <Input
                        value={resi}
                        onChange={(e) => setResi(e.target.value)}
                        placeholder="Contoh: JNE - JP12345678"
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button onClick={() => onSubmit(resi)} disabled={!resi}>
                        Simpan & Kirim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
