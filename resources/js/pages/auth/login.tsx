import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/login');
    }

    return (
        <AuthLayout
            title="Entrar"
            description="Entre com seu e-mail e senha para acessar a plataforma."
        >
            <Head title="Entrar" />
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="email">
                        Endereço de e-mail
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">
                            Senha
                        </Label>
                    </div>

                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                     {errors.password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="flex items-center">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            Lembrar de mim
                        </span>
                    </label>
                </div>

                <div>
                    <Button type="submit" className="w-full" disabled={processing}>
                        Entrar
                    </Button>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Não tem uma conta?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-gray-800 hover:text-gray-700 dark:text-gray-200 dark:hover:text-white"
                    >
                        Cadastre-se
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}