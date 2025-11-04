import { twMerge } from 'tailwind-merge';

interface AppLogoProps {
    className?: string;
}

export const AppLogo = ({ className = '', ...props }: AppLogoProps) => (
    <div
        className={twMerge(
            'flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-lg font-bold text-white',
            className,
        )}
        {...props}
    >
        LS
    </div>
);