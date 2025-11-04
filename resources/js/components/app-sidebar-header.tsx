import { dashboard } from '@/routes';
import { Link } from '@inertiajs/react';

export const AppSidebarHeader = () => (
    <Link href={dashboard()} className="flex items-center gap-2 px-2">
        <span className="text-lg font-semibold">
            LinkShift
        </span>
    </Link>
);