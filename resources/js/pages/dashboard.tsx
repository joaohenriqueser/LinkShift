import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Shortlink } from '@/types';
import { useEffect, useState } from 'react';
import api from '@/lib/api'; 
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function Dashboard() {
    const [links, setLinks] = useState<Shortlink[]>([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/api/shortlinks')
            .then(response => {
                setLinks(response.data);
            })
            .catch(err => {
                console.error('Erro ao buscar shortlinks:', err);
                setError('Não foi possível carregar os links.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []); 

    return (
        <AppLayout>
            <Head title="Meus Shortlinks" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Meus Shortlinks
                        </h2>
                        {/* --- CORREÇÃO: URL REAL --- */}
                        <Button asChild>
                            <Link href="/shortlinks/create">
                                Criar Novo Shortlink
                            </Link>
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Listagem</CardTitle>
                            <CardDescription>
                                Seus links cadastrados.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loading && <p>Carregando...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            {!loading && !error && (
                                <>
                                    {links.length === 0 && (
                                        <p>Você ainda não tem nenhum link cadastrado.</p>
                                    )}
                                    {links.map((link) => (
                                        <div
                                            key={link.id}
                                            className="flex items-center justify-between rounded border p-4"
                                        >
                                            <div>
                                                <h3 className="font-semibold">{link.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    /{link.slug}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {/* --- CORREÇÃO: URLs REAIS --- */}
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/shortlinks/${link.slug}/report`}>
                                                        Relatório
                                                    </Link>
                                                </Button>
                                                <Button variant="secondary" size="sm" asChild>
                                                    <Link href={`/shortlinks/${link.slug}/edit`}>
                                                        Editar
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}