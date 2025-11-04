import AppLayout from '@/layouts/app-layout';
// REMOVEMOS A IMPORTAÇÃO DE ROTA
import { Head, Link } from '@inertiajs/react';
import { Shortlink } from '@/types'; 
import { useState, useEffect, FormEvent } from 'react';
import api from '@/lib/api';
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
import { Skeleton } from '@/components/ui/skeleton';

// ... (Tipos VariantReport, ReportData, helpers de data, interface ReportProps...)
type VariantReport = Shortlink['variants'][0] & {
    clicks_count: number;
};
type ReportData = {
    total_clicks_in_period: number;
    variants_report: VariantReport[];
};
const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
};
const defaultEndDate = new Date();
const defaultStartDate = new Date();
defaultStartDate.setDate(defaultEndDate.getDate() - 7); 
interface ReportProps {
    shortlink: Shortlink;
}

export default function ShortlinkReport({ shortlink }: ReportProps) {
    // ... (todos os 'useState' e funções 'fetchReport', 'useEffect', 'handleSubmit'...)
    const [startDate, setStartDate] = useState(formatDateForInput(defaultStartDate));
    const [endDate, setEndDate] = useState(formatDateForInput(defaultEndDate));
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = (start: string, end: string) => {
        setLoading(true);
        setError(null);
        api.get(`/api/shortlinks/${shortlink.slug}/report`, {
            params: { start_date: start, end_date: end }
        })
        .then(response => {
            setReportData(response.data);
        })
        .catch(err => {
            console.error('Erro ao buscar relatório:', err);
            setError('Não foi possível carregar os dados do relatório.');
        })
        .finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        api.get(`/api/shortlinks/${shortlink.slug}/report`, {
            params: {
                start_date: startDate,
                end_date: endDate,
            }
        })
        .then(response => {
            setReportData(response.data);
        })
        .catch(err => {
            console.error('Erro ao buscar relatório:', err);
            setError('Não foi possível carregar os dados do relatório.');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []); 

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetchReport(startDate, endDate);
    };

    return (
        <AppLayout>
            <Head title={`Relatório: ${shortlink.title}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* --- CORREÇÃO: URL REAL --- */}
                    <Link
                        href="/dashboard"
                        className="mb-4 inline-block text-sm text-gray-600 hover:underline dark:text-gray-400"
                    >
                        &larr; Voltar para a listagem
                    </Link>
                    
                    {/* ... (resto do JSX: Card, form, tabela) ... */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Relatório: {shortlink.title}</CardTitle>
                            <CardDescription>
                                Exibindo cliques para <span className="font-semibold">/redir/{shortlink.slug}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border p-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Data de Início</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Data de Fim</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Buscando...' : 'Filtrar'}
                                </Button>
                            </form>
                            <div>
                                {error && <p className="text-red-500">{error}</p>}
                                {loading && (
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-1/3" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                )}
                                {!loading && reportData && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">
                                            Total de cliques no período: {reportData.total_clicks_in_period}
                                        </h3>
                                        <div className="overflow-x-auto rounded-md border">
                                            <table className="min-w-full divide-y divide-gray-200 text-left dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium">Variante (URL)</th>
                                                        <th className="px-4 py-3 font-medium">% Esperada (Peso)</th>
                                                        <th className="px-4 py-3 font-medium">Cliques</th>
                                                        <th className="px-4 py-3 font-medium">% Final (Real)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {reportData.variants_report.map((variant) => {
                                                        const total = reportData.total_clicks_in_period;
                                                        const finalPct = total > 0 
                                                            ? (variant.clicks_count / total) * 100 
                                                            : 0;
                                                        return (
                                                            <tr key={variant.id}>
                                                                <td className="truncate px-4 py-3" style={{ maxWidth: '300px' }}>
                                                                    {variant.url}
                                                                </td>
                                                                <td className="px-4 py-3">{variant.weight}%</td>
                                                                <td className="px-4 py-3">{variant.clicks_count}</td>
                                                                <td className="px-4 py-3 font-semibold">
                                                                    {finalPct.toFixed(2)}%
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div> 
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}