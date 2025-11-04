import { AppLogo } from '@/components/app-logo';
import { Head, Link } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AuthLayoutTemplateProps {
    children: ReactNode;
    title: string;
    description: string;
}

export default function AuthLayoutTemplate({
    children,
    title,
    description,
}: AuthLayoutTemplateProps) {
    return (
        <>
            <Head title={title} />

            {/* 1. Fundo preto (como você pediu) */}
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-100 p-6 dark:bg-black">
                <Link
                    href="/" 
                    className="absolute top-0 left-0 mt-4 ml-4 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    &larr; Voltar para o Início
                </Link>

                {/* 2. Este é o Card ÚNICO.
                       Movemos as classes de 'card' (bg-white, dark:bg-gray-800) para este container. */}
                <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 sm:p-8">

                    {/* 3. Logo, Título e Descrição vêm PRIMEIRO, DENTRO do card */}
                    <div className="flex flex-col items-center">
                        <AppLogo className="h-10 w-auto fill-current" />
                        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            {description}
                        </p>
                    </div>

                    {/* 4. O formulário (children) vem logo abaixo, DENTRO do mesmo card */}
                    <div className="mt-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}