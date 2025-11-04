import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/register');
    }

    return (
        <AuthLayout
            title="Cadastre-se"
            description="Crie sua conta para começar a usar o LinkShift."
        >
            <Head title="Cadastrar" />
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="email">Endereço de e-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password_confirmation">Confirmar Senha</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    {errors.password_confirmation && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end">
                    <Link
                        href="/login"
                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        Já tem uma conta?
                    </Link>
                </div>

                <div>
                    <Button type="submit" className="w-full" disabled={processing}>
                        Cadastrar
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}