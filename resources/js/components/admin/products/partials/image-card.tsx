import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ImageOff, ImagePlus, X } from 'lucide-react';
import { useState } from 'react';

export default function ImageCard({
    data,
    setData,
    errors,
    isEditMode,
    initialImage,
}) {
    const [imagePreview, setImagePreview] = useState(initialImage);
    const [isImageError, setIsImageError] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setIsImageError(false);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setData('image', null);
        setIsImageError(false);
        setImagePreview(null);
    };

    return (
        <Card className="overflow-hidden border-blue-200 shadow-sm lg:border-border">
            <CardHeader className="bg-blue-50/50 lg:bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-base">
                    <ImagePlus className="h-4 w-4 text-blue-600 lg:text-gray-500" />
                    Foto Produk <span className="text-red-500">*</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="w-full space-y-4">
                    {imagePreview && !isImageError ? (
                        <div className="group relative aspect-square w-full overflow-hidden rounded-xl border bg-gray-100">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={() => setIsImageError(true)}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={clearImage}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" /> Ganti Foto
                                </Button>
                            </div>
                            {data.image ? (
                                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs text-white shadow-sm">
                                    <CheckCircle2 className="h-3 w-3" /> Foto
                                    Baru
                                </div>
                            ) : (
                                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 text-xs text-white shadow-sm">
                                    <CheckCircle2 className="h-3 w-3" />{' '}
                                    Terpasang
                                </div>
                            )}
                        </div>
                    ) : (
                        <Label
                            htmlFor="image-upload"
                            className="group flex h-64 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-all hover:border-primary hover:bg-gray-50"
                        >
                            <div className="rounded-full bg-gray-100 p-4 transition-colors group-hover:bg-primary/10">
                                {isImageError ? (
                                    <ImageOff className="h-8 w-8 text-gray-400" />
                                ) : (
                                    <ImagePlus className="h-8 w-8 text-gray-500 group-hover:text-primary" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <span className="block text-sm font-medium text-gray-900">
                                    {isImageError
                                        ? 'Gambar rusak'
                                        : isEditMode
                                          ? 'Upload Foto Baru (Wajib)'
                                          : 'Klik untuk upload gambar'}
                                </span>
                                <span className="block text-xs text-gray-500">
                                    JPG, PNG, WEBP (Max 2MB)
                                </span>
                            </div>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </Label>
                    )}
                    {errors.image && <InputError message={errors.image} />}
                </div>
            </CardContent>
        </Card>
    );
}
