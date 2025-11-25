import InputError from '@/components/input-error';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function InfoCard({ data, setData, errors, categories }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Produk</CardTitle>
                <CardDescription>
                    Detail dasar mengenai produk ayam.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Nama Produk <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        placeholder="Contoh: Ayam Potong Utuh (1kg)"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category_id">
                        Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        onValueChange={(value) => setData('category_id', value)}
                        value={data.category_id}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="-- Pilih Kategori --" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.category_id} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Produk</Label>
                    <Textarea
                        id="description"
                        rows={4}
                        placeholder="Jelaskan kondisi ayam, berat rata-rata, dll..."
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} />
                </div>
            </CardContent>
        </Card>
    );
}
