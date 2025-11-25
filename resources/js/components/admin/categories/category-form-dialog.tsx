import InputError from '@/components/input-error';
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
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function CategoryFormDialog({
    open,
    onOpenChange,
    category = null,
}) {
    const isEdit = !!category;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: category?.name || '',
    });

    // Reset form saat dialog dibuka/ditutup atau kategori berubah
    useEffect(() => {
        if (open) {
            setData('name', category?.name || '');
        } else {
            reset();
        }
    }, [open, category]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/categories/${category.id}`, {
                onSuccess: () => {
                    toast.success('Kategori berhasil diperbarui');
                    onOpenChange(false);
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    toast.success('Kategori berhasil ditambahkan');
                    onOpenChange(false); // Tutup dialog
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Ubah nama kategori produk.'
                            : 'Buat kategori baru untuk mengelompokkan produk.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Kategori</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Ayam Utuh"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
