import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Shortlink, ShortlinkVariant } from '@/types';
import { FormEvent, useState } from 'react';
import api from '@/lib/api';
import axios from 'axios';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Trash2, TriangleAlert, CheckCircle2 } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const newVariantBase: Omit<ShortlinkVariant, 'id' | 'created_at' | 'updated_at'> = {
    url: '',
    weight: 0,
};

type ShortlinkFormData = {
    title: string;
    slug: string;
    variants: Array<{
        id?: number;
        url: string;
        weight: number | string;
    }>;
};

interface ShortlinkFormProps {
    shortlink: Shortlink | null;
}

export default function ShortlinkForm({ shortlink }: ShortlinkFormProps) {
    const isEditMode = Boolean(shortlink);

    const { data, setData, reset } = useForm<ShortlinkFormData>({
        title: shortlink?.title || '',
        slug: shortlink?.slug || '',
        variants: shortlink?.variants || [newVariantBase],
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const totalWeight = data.variants.reduce((acc: number, variant) => {
        return acc + (Number(variant.weight) || 0);
    }, 0);
    
    const handleVariantChange = (
        index: number,
        field: 'url' | 'weight',
        value: string | number,
    ) => {
        setData('variants', data.variants.map((v, i) => 
            i === index ? { ...v, [field]: value } : v
        ));
    };

    const addVariant = () => {
        setData('variants', [...data.variants, newVariantBase]);
    };

    const removeVariant = (index: number) => {
        if (data.variants.length <= 1) return; 
        setData('variants', data.variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setValidationErrors({});
        setSuccessMessage(null);

        try {
            if (isEditMode) {
                await api.put(`/api/shortlinks/${shortlink?.slug}`, data);
                setSuccessMessage('Shortlink atualizado com sucesso!');
            } else {
                await api.post('/api/shortlinks', data);
                setSuccessMessage('Shortlink criado com sucesso!');
                reset(); 
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            } else {
                console.error("Erro inesperado:", error);
                setValidationErrors({ general: 'Ocorreu um erro. Tente novamente.' });
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!shortlink) return;
        setIsProcessing(true);
        setValidationErrors({});
        setSuccessMessage(null);

        try {
            await api.delete(`/api/shortlinks/${shortlink.slug}`);
            
            setIsDeleteAlertOpen(false);
            setSuccessMessage('Shortlink deletado com sucesso! Redirecionando...');

            setTimeout(() => {
                router.visit('/dashboard');
            }, 2000);

        } catch (error) {
            console.error("Erro ao deletar:", error);
            setValidationErrors({ general: 'Não foi possível deletar o link.' });
            setIsProcessing(false);
            setIsDeleteAlertOpen(false);
        }
    };

    return (
        <AppLayout>
            <Head title={isEditMode ? 'Editar Shortlink' : 'Novo Shortlink'} />
            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Link
                        href="/dashboard"
                        className="mb-4 inline-block text-sm text-gray-600 hover:underline dark:text-gray-400"
                    >
                        &larr; Voltar para a listagem
                    </Link>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {isEditMode ? 'Editar Shortlink' : 'Criar Novo Shortlink'}
                            </CardTitle>
                            <CardDescription>
                                Preencha os dados principais e adicione as
                                variantes de destino.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            
                            {validationErrors.general && (
                                <Alert variant="destructive" className="mb-4">
                                    <TriangleAlert className="h-4 w-4" />
                                    <AlertTitle>Erro</AlertTitle>
                                    <AlertDescription>{validationErrors.general}</AlertDescription>
                                </Alert>
                            )}

                            {successMessage && (
                                <Alert className="mb-4 border-green-500 text-green-700 dark:border-green-600 dark:text-green-500">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle>Sucesso!</AlertTitle>
                                    <AlertDescription>{successMessage}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        disabled={isProcessing}
                                    />
                                    {validationErrors.title && (
                                        <p className="text-sm text-red-500">{validationErrors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (O link)</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        disabled={isProcessing}
                                        placeholder="ex: promo-natal"
                                    />
                                    <p className="text-sm text-gray-500">
                                        URL final será: /redir/{data.slug}
                                    </p>
                                    {validationErrors.slug && (
                                        <p className="text-sm text-red-500">{validationErrors.slug}</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <Label>Variantes de Destino</Label>
                                    {validationErrors.variants && (
                                        <p className="text-sm text-red-500">{validationErrors.variants}</p>
                                    )}

                                    {data.variants.map((variant, index) => (
                                        <div key={index} className="flex gap-2 rounded border p-4">
                                            <div className="flex-1 space-y-2">
                                                <Label htmlFor={`variant_url_${index}`}>URL de Destino</Label>
                                                <Input
                                                    id={`variant_url_${index}`}
                                                    value={variant.url}
                                                    onChange={(e) => handleVariantChange(index, 'url', e.target.value)}
                                                    placeholder="https://..."
                                                    disabled={isProcessing}
                                                />
                                                {validationErrors[`variants.${index}.url`] && (
                                                    <p className="text-sm text-red-500">{validationErrors[`variants.${index}.url`]}</p>
                                                )}
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <Label htmlFor={`variant_weight_${index}`}>Peso (%)</Label>
                                                <Input
                                                    id={`variant_weight_${index}`}
                                                    type="number"
                                                    value={variant.weight}
                                                    onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                                                    disabled={isProcessing}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeVariant(index)}
                                                disabled={isProcessing || data.variants.length <= 1}
                                                className="mt-6"
                                                aria-label="Remover variante"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <div className={`text-sm ${totalWeight !== 100 ? 'text-red-500' : 'text-green-500'}`}>
                                        Soma dos pesos: {totalWeight}%
                                    </div>
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addVariant}
                                        disabled={isProcessing}
                                    >
                                        Adicionar Variante
                                    </Button>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    {isEditMode && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => setIsDeleteAlertOpen(true)}
                                            disabled={isProcessing}
                                        >
                                            Deletar Link
                                        </Button>
                                    )}
                                    {!isEditMode && <div />}

                                    <Button type="submit" disabled={isProcessing}>
                                        {isProcessing
                                            ? 'Salvando...'
                                            : isEditMode
                                              ? 'Atualizar Shortlink'
                                              : 'Salvar Shortlink'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {isEditMode && (
                        <Alert variant="destructive" className="mt-6">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>Zona de Perigo</AlertTitle>
                            <AlertDescription>
                                Deletar este shortlink é uma ação permanente e
                                removerá todos os dados de clique associados.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>

            <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Você tem certeza absoluta?</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. Isso irá deletar
                            permanentemente o shortlink <strong>{shortlink?.title}</strong> ({shortlink?.slug})
                            e todos os seus dados de cliques.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isProcessing}>Cancelar</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Deletando...' : 'Sim, deletar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}