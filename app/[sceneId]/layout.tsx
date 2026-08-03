import type { ReactNode } from 'react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { TitleUpdater } from '@/components/scene/TitleUpdater';
import { Breadcrumbs } from '@/components/scene/Breadcrumbs';
import { SceneList } from '@/components/scene/SceneList';
import { Sidebar } from '@/components/sidebar/Sidebar';

import { Home } from 'lucide-react';

export default function CanvasLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full h-screen bg-background p-1 overflow-x-hidden" translate="no">
            <TitleUpdater />

            <div className="flex flex-col flex-1 gap-1">
                <div className="fixed flex items-center gap-1 z-20 bg-depth-1 p-1 m-1 rounded-md border border-depth-3 shadow-xs">
                    <Link
                        href="/"
                        className="flex items-center w-8 h-8 p-2 rounded-md bg-depth-2 hover:bg-depth-3 border border-depth-3 cursor-pointer"
                    >
                        <Home size={16} />
                    </Link>

                    <ThemeToggle />

                    <hr className="h-6 mx-1 border-l border-depth-3" />

                    <Breadcrumbs />
                    <SceneList />
                </div>

                {children}
            </div>

            <Sidebar />
        </div>
    );
}
